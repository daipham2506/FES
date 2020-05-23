import React, { useState } from 'react'

import {
  Form,
  Button,
  Select,
  Tabs,
  Row,
  Upload,
  message,
  List,
  Avatar,
  Spin
} from 'antd';

import { LockFilled, AndroidOutlined, InboxOutlined } from '@ant-design/icons';

import '../styles/form.css'

import callApi from '../utils/callApi'


const { TabPane } = Tabs;
const { Dragger } = Upload;

const FormInput = () => {

  const [loading, setloading] = useState(false)

  const [form, setform] = useState({
    fileList: [],
    keyList: [],
    algo: '',
    mode: '',
    result: []
  });

  const onRemove = file => {
    const index = form.fileList.indexOf(file.originFileObj.path);
    const newFileList = form.fileList;
    newFileList.splice(index, 1);
    setform({
      ...form,
      fileList: newFileList
    })
  }

  const onChange = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      let pathList = []
      for (let i = 0; i < info.fileList.length; i++) {
        pathList.push(info.fileList[i].originFileObj.path)
      }
      setform({
        ...form,
        fileList: pathList
      })
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const onClick =()=>{
    // console.log('form', form);
    
  }

  const onAddKey = file => {
    if (form.keyList.length === 1) {
      message.error('Only one key file is needed to decrypt/encrypt');
      return false;
    }
    
    setform({
      ...form,
      keyList: [file]
    })
    return false;
  };

  const onRemoveKey = key => {
    setform({
      ...form,
      keyList: []
    })
  };

  const onChangeSelect = (e, k) => {
    setform({
      ...form,
      [k]: e
    })
  }

  const onFinish = async () => {
    if (form.fileList === []) {
      message.error('Please wait for upload file done!');
      return false;
    }

    if (form.keyList === []){
      message.error('Please choose key file!', 3);
      return false;
    }

    setloading(true);
    try {
      let data = {
        fileList: form.fileList,
        keyPath: form.keyList[0].path,
        mode: form.mode,
        algo: form.algo
      }

      console.log('data', data);
      
      const res = await callApi('/api/crypt', 'POST', data);
      setloading(false)

      setform({
        ...form,
        result: res.data
      })

      if (form.mode === "dec") {
        message.success(res.data.length + " files have decrypted successfully!", 3)
      } else if (form.mode === "enc") {
        message.success(res.data.length + " files have encrypted successfully!", 3)
      }

    } catch (error) {
      setloading(false)
      message.error(error.response.data, 3)
    }
  };

  return (

    <Spin tip="Processing..." spinning={loading}>
      <Tabs defaultActiveKey="1"
        style={{ textAlign: "center" }}>
        <TabPane
          tab={
            <span style={{ paddingLeft: 20, paddingRight: 20 }}>
              <LockFilled />
          EnCrypt/Decrypt
        </span>
          }
          key="1"
        >
          <div>
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size='large'
              onFinish={onFinish}
            >
              <Form.Item
                label="Input Files"
                name='filePath'
                rules={[{ required: true, message: 'Please input your file!' }]}
              >
                <Dragger
                  name="file"
                  multiple={true}
                  action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                  onChange={onChange}
                  onRemove={onRemove}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
                </Dragger>
              </Form.Item>

              {/* <Form.Item
              label="Output Directory"
              name='outputPath'
              rules={[{ required: true, message: 'Please input output directory!' }]}
            >
              <Row>
                <Col span={20}>
                  <Input value={form.outputPath} disabled style={{ color: 'blue' }} />
                </Col>
                <Col span={4} >
                  <Upload
                    className='hidden'
                    directory={true}
                    name="file"
                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                    beforeUpload={beforeUpload}
                  >
                    <Button >
                      <UploadOutlined /> Browser
                    </Button>
                  </Upload>

                </Col>
              </Row>
            </Form.Item> */}

              <Form.Item
                label="Key File"
                name='keyList'
                rules={[{ required: true, message: 'Please choose key file!' }]}
              >
                <Dragger
                  name="file"
                  multiple={false}
                  action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                  accept=".doc,.docx,application/msword,.txt"
                  fileList={form.keyList}
                  beforeUpload={onAddKey}
                  onRemove={onRemoveKey}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
              </Form.Item>

              <Form.Item label="Algorithm" name='algo'
                rules={[{ required: true, message: 'Please select algorithm!' }]}
              >

                <Select placeholder="Select a algorithm" onChange={e => onChangeSelect(e, "algo")}>
                  <Select.Option value="aes">AES</Select.Option>
                  <Select.Option value="rsa">RSA</Select.Option>
                </Select>

              </Form.Item>

              <Form.Item label="Mode" name='mode'
                rules={[{ required: true, message: 'Please select mode!' }]}
              >
                <Select placeholder="Select a mode" onChange={e => onChangeSelect(e, "mode")}>
                  <Select.Option value="enc">Encrypt</Select.Option>
                  <Select.Option value="dec">Decrypt</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ justifyContent: 'center' }}>
                <Row >
                  <Button type='primary' htmlType="submit" style={{ width: 100 }} onClick={onClick}> Perform! </Button>
                  <Button style={{ marginLeft: 30, width: 100 }} onClick={() => { window.location.reload(); }}> Reset </Button>
                </Row>
              </Form.Item>

              {form.result.length > 0 &&
                <Form.Item style={{ justifyContent: 'center' }}>
                  <Row className='result'>
                    <List
                      itemLayout="horizontal"
                      dataSource={form.result}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-folder-vector-icon-png-image_3725290.jpg" />}
                            title={<span style={{ textAlign: "left" }}>{item.name} </span>}
                            description={"Path:  " + item.path}
                          />
                        </List.Item>
                      )}
                    />
                  </Row>
                </Form.Item>
              }
            </Form>
          </div>
        </TabPane>



        <TabPane
          tab={
            <span style={{ paddingLeft: 20, paddingRight: 20 }}>
              <AndroidOutlined />
              Checksum
            </span>
          }
          key="2"
        >
          Tab 2
        </TabPane>
      </Tabs>
    </Spin>
  );
}

export default FormInput

