import React, { useState } from 'react'

import {
  Form,
  Button,
  Select,
  Tabs,
  Row, Col,
  Upload,
  message,
  List,
  Avatar,
  Spin,
  Input,
  Switch
} from 'antd';

import { LockFilled, CheckCircleOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';

import '../styles/form.css'

import callApi from '../utils/callApi'


const { TabPane } = Tabs;
const { Dragger } = Upload;
const { TextArea } = Input;

const FormInput = () => {

  const [loading, setloading] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [onDir, setOnDir] = useState(false)

  const [form, setform] = useState({
    fileList: [],
    keyPath: '',
    algo: '',
    mode: '',
    result: []
  });

  const [formCheck, setformCheck] = useState({
    originalFile: null,
    decryptedFile: null,
    hashOri: '',
    hashDec: '',
  })

  const beforeUpload = (file, type) => {
    if (type === "ori") {
      setformCheck({
        ...formCheck,
        originalFile: file
      })
    } else if (type === "dec") {
      setformCheck({
        ...formCheck,
        decryptedFile: file
      })
    } else if (type === "key") {
      setform({
        ...form,
        keyPath: file.path
      })
    }
  }

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
        if (!pathList.includes(info.fileList[i].originFileObj.path))
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

    if (form.keyList === []) {
      message.error('Please choose key file!', 3);
      return false;
    }

    setloading(true);
    try {
      let data = {
        fileList: form.fileList,
        keyPath: form.keyPath,
        mode: form.mode,
        algo: form.algo
      }
      let time = (new Date()).getTime();

      const res = await callApi('/api/crypt', 'POST', data);

      let time2 = (new Date()).getTime();

      setTotalTime(time2 - time);
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

  const onFinishCheck = async (values) => {

    setloading(true);
    try {
      let data = {
        originalFile: formCheck.originalFile.path,
        decryptedFile: formCheck.decryptedFile.path
      }

      const res = await callApi('/api/integrity', 'POST', data);

      setloading(false)

      setformCheck({
        ...formCheck,
        hashOri: res.data.hashOri,
        hashDec: res.data.hashDec
      })

      if (res.data.hashOri === res.data.hashDec) {
        message.success("These hashes of two files are exactly the same", 3)
      } else {
        message.error("These hashes of two files are different", 3)
      }

    } catch (error) {
      setloading(false)
      message.error(error.response.data, 5)
    }

  }

  return (
    <Tabs defaultActiveKey={"1"}
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
          <Spin tip="Processing..." spinning={loading}>
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size='large'
              onFinish={onFinish}
            >
              <Row>
                <Col span={5} />
                <Col span={19}>
                  <div style={{ textAlign: 'left', margin: '10px 0' }}>
                    <h6 style={{ display: 'inline' }}> Turn on to choose all files from directory</h6>
                    <Switch style={{ marginLeft: 10 }}
                      onChange={e => setOnDir(e)}
                    />
                  </div>
                </Col>
              </Row>

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
                  directory={onDir}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support to upload one or more different files or all files from a directory.
                </p>
                </Dragger>
              </Form.Item>

              <Form.Item
                label="Key File"
                name="keyPath"
                rules={[{ required: true, message: 'Please choose key file!' }]}
              >
                <Row>
                  <Col span={20}>
                    <Input value={form.keyPath} disabled style={{ color: 'blue' }} />
                  </Col>
                  <Col span={4} >
                    <Upload
                      className='hidden'
                      multiple={false}
                      name="file"
                      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                      accept=".doc,.docx,application/msword,.txt"
                      beforeUpload={file => beforeUpload(file, "key")}
                    >
                      <Button style={{ marginLeft: 5 }}>
                        <UploadOutlined /> Browser
                      </Button>
                    </Upload>
                  </Col>
                </Row>
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

              <Form.Item style={{ justifyContent: 'center', marginTop: 10 }}>
                <Button type='primary' htmlType="submit" style={{ width: 100 }} > Perform! </Button>
                <Button style={{ marginLeft: 30, width: 100 }} onClick={() => window.location.reload()}> Reset </Button>
              </Form.Item>

              {form.result.length > 0 &&
                <Form.Item style={{ justifyContent: 'center' }}>
                  <Row className='result'>
                    <h6 > The Path contain file after {form.mode === "enc" ? "encrypted" : "decrypted"}</h6>
                  </Row>
                  <Row className='result'>
                    <List
                      itemLayout="horizontal"
                      dataSource={form.result}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta style={{ textAlign: "left" }}
                            avatar={<Avatar src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-folder-vector-icon-png-image_3725290.jpg" />}
                            title={<span >{item.name} </span>}
                            description={"Path:  " + item.path}
                          />
                        </List.Item>
                      )}
                    />
                  </Row>
                  <Row className='result'>
                    <h6> Total time: {totalTime} miliseconds</h6>
                  </Row>
                </Form.Item>
              }
            </Form>
          </Spin>
        </div>
      </TabPane>

      <TabPane
        tab={
          <span style={{ paddingLeft: 20, paddingRight: 20 }}>
            <CheckCircleOutlined />
              Checksum
            </span>
        }
        key="2"
      >
        <div>
          <Spin tip="Processing..." spinning={loading}>
            <Form
              style={{ marginTop: 30 }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size='large'
              onFinish={onFinishCheck}
            >

              <Form.Item
                label="Original File"
                name="originalFile"
                rules={[{ required: true, message: 'Please choose original file!' }]}
              >
                <Row>
                  <Col span={20}>
                    <Input value={formCheck.originalFile ? formCheck.originalFile.path : ""} disabled style={{ color: 'blue' }} />
                  </Col>
                  <Col span={4} >
                    <Upload
                      className='hidden'
                      multiple={false}
                      name="file"
                      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                      beforeUpload={(file) => beforeUpload(file, "ori")}
                    >
                      <Button style={{ marginLeft: 15 }}>
                        <UploadOutlined /> Browser
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Form.Item>


              <Form.Item
                label="Decrypted File"
                name="decryptedFile"
                rules={[{ required: true, message: 'Please choose decrypted file!' }]}
              >
                <Row>
                  <Col span={20}>
                    <Input value={formCheck.decryptedFile ? formCheck.decryptedFile.path : ""} disabled style={{ color: 'blue' }} />
                  </Col>
                  <Col span={4} >
                    <Upload
                      className='hidden'
                      multiple={false}
                      name="file"
                      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                      beforeUpload={(file) => beforeUpload(file, "dec")}
                    >
                      <Button style={{ marginLeft: 15 }}>
                        <UploadOutlined /> Browser
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Form.Item>


              <Form.Item style={{ justifyContent: 'center' }}>
                <Button type='primary' htmlType="submit" style={{ width: 100, marginLeft: -20, marginTop: 10 }}> Compare </Button>
                <Button style={{ width: 100, marginLeft: 20, marginTop: 10 }}
                  onClick={() => {
                    window.location.reload();
                  }}
                > Reset </Button>
              </Form.Item>

              {formCheck.hashOri && formCheck.hashDec &&
                <Form.Item
                  label="Hash code of original file"
                >
                  <TextArea rows={4} value={formCheck.hashOri} style={{ color: 'green', fontSize: 18 }} />
                </Form.Item>
              }

              {formCheck.hashOri && formCheck.hashDec &&
                <Form.Item
                  label="Hash code of decrypted file"
                >
                  <TextArea rows={4} value={formCheck.hashDec} style={{ color: 'green', fontSize: 18 }} />
                </Form.Item>
              }

            </Form>
          </Spin>
        </div>

      </TabPane>
    </Tabs>
  );
}

export default FormInput

