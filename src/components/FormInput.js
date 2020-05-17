import React, { useState } from 'react'

import {
  Form,
  Input,
  Button,
  Select,
  Tabs,
  Row, Col,
  Upload,
  message,
} from 'antd';

import { LockFilled, AndroidOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';

import '../styles/form.css'

import callApi from '../utils/callApi'


const { TabPane } = Tabs;
const { Dragger } = Upload;


const FormInput = () => {

  const [form, setform] = useState({
    fileList: [],
    outputPath: '',
    keyPath: [],
    algo: '',
    mode: '',
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

  const beforeUpload = (file) => {
    setform({
      ...form,
      outputPath: file.path.replace("/" + file.name, "")
    })
  }

  const onAddKey = file => {
    if (form.keyPath.length === 1) {
      message.error('Only one key file is needed to decrypt/encrypt');
      return false;
    }

    setform({
      ...form,
      keyPath: [file.path]
    })
    return false;
  };

  const onRemoveKey = key => {
    setform({
      ...form,
      keyPath: []
    })
    return false;
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

    if (form.algo === 'aes') {
      try {
        const res = await callApi('/api/aes', 'POST', form);
        message.success(res.data, 3)

        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } catch (error) {
        message.error(error.response.data, 3)
      }
    } 
    else if (form.algo === 'rsa') {

    }
  };

  return (
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

            <Form.Item
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
            </Form.Item>

            <Form.Item
              label="Key File"
              name='keyPath'
              rules={[{ required: true, message: 'Please choose key file!' }]}
            >
              <Dragger
                name="file"
                multiple={false}
                action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
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
                <Button type='primary' htmlType="submit" > Perform! </Button>
              </Row>
            </Form.Item>
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
  );
}

export default FormInput

