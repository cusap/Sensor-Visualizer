import React from "react";
import axios from "axios";
import logo from "./logo.svg";
import { Layout, Menu, Breadcrumb, Card, Row, Col, Button } from "antd";
import "./App.css";

const IP = "192.168.0.181:3000";

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { env: null, data: null };
    this.reload = this.reload.bind(this);
  }

  reload = async () => {
    const response = await axios.get(
      "http://" + IP + "/read/hdsnsFxV4rWaUSuqnARe"
    );
    if (response.data) {
      this.setState({ data: response.data });
    }
  };

  componentDidMount = async () => {
    // const envToken = await localStorage.getItem("environment");
    // if (envToken) {
    //   this.setState({ env: envToken });
    // }
    const response = await axios.get(
      "http://" + IP + "/read/hdsnsFxV4rWaUSuqnARe"
    );
    if (response.data) {
      console.log(response.data);
      this.setState({ data: response.data });
    }
  };
  render() {
    const { env, data } = this.state;
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <h1 style={{ color: "white" }}>Hydroponics Sensor Visualizer</h1>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          ></Menu>
        </Header>
        <Content style={{ padding: "50px 50px" }}>
          <Button onClick={() => this.reload()}>Reload</Button>
          <div style={{ background: "#fff", padding: 24, minHeight: 500 }}>
            <Row>
              {data ? (
                data.map(data => {
                  return (
                    <Col key={data.name} span={8}>
                      <Card
                        title={data.name}
                        bordered={false}
                        style={{ width: 300 }}
                      >
                        <p>{data.value}</p>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <h1>Please Add Sensors</h1>
              )}
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          EID101-F ©2019 Created by Dhvanil Shah
        </Footer>
      </Layout>
    );
  }
}

export default App;
