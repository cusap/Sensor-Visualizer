import requests as req


def call_api(sensor_name, sensor_value):
    ENV = "dhvanil"
    SECRET = "shah"
    IP_ADDR = "192.168.1.31:3000"

    JOIN_REQUEST = "http://{}/joinEnvironment/{}/secret/{}".format(
        IP_ADDR, ENV, SECRET)

    r = req.get(url=JOIN_REQUEST)
    env_key = r.content.decode('utf-8')

    ADD_REQUEST = "http://{}/sensor/{}/value/{}/env/{}".format(
        IP_ADDR, sensor_name, sensor_value, env_key)
    r = req.get(url=ADD_REQUEST)
    print(r.content)
