import mqtt from "mqtt";

// MQTT 配置
export const MQTT_CONFIG = {
  server: "ws://192.168.2.209:8083/mqtt",
  options: {
    clean: true,
    reconnectPeriod: 0, // 重连间隔
    connectTimeout: 30 * 1000, // 连接超时时间
    clientId: "mqttjs_c4d825c12a",
  },
  publishTopic: "topic2",
  subscribeTopic: "topic1",
};

class MQTTService {
  constructor() {
    this.client = null;
    this.messageHandlers = new Set();
    this.connectHandler = null;
    this.errorHandler = null;
    this.subscribeList = new Set();
  }

  // 连接MQTT服务器
  connect() {
    if (this.client && this.client.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(MQTT_CONFIG.server, MQTT_CONFIG.options);

      this.client.on("connect", () => {
        console.log("MQTT Connected");
        // this.subscribe(subscribeTopic || MQTT_CONFIG.subscribeTopic);
        if (this.connectHandler) {
          this.connectHandler();
        }
        resolve();
      });

      this.client.on("error", (error) => {
        console.error("MQTT Error:", error);
        if (this.errorHandler) {
          this.errorHandler(error);
        }
        reject(error);
      });

      this.client.on("message", (topic, message) => {
        const payload = message.toString();
        console.log(`Received message on ${topic}:`, payload);
        this.messageHandlers.forEach((handler) => handler(topic, payload));
      });

      this.client.on("close", () => {
        console.log("MQTT Connection closed");
      });

      this.client.on("reconnect", () => {
        console.log("MQTT Reconnecting...");
      });
    });
  }

  // 断开连接
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  // 订阅主题
  subscribe(topic) {
    if (this.client && this.client.connected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
      this.subscribeList.add(topic);
    }
  }

  // 取消订阅
  unsubscribe(topic) {
    if (this.client && this.client.connected) {
      this.client.unsubscribe(topic, (err) => {
        if (err) {
          console.error("Unsubscribe error:", err);
        } else {
          console.log(`Unsubscribed from ${topic}`);
        }
      });
      this.subscribeList.delete(topic);
    }
  }

  // 发布消息
  publish(topic, message) {
    console.log(this.client, this.client.connected)
    if (this.client && this.client.connected) {
      this.client.publish(topic, message, (err) => {
        if (err) {
          console.error("Publish error:", err);
        } else {
          console.log(`Message published to ${topic}:`, message);
        }
      });
    } else {
      console.error("MQTT client not connected");
    }
  }

  // 添加消息处理器
  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  addDisConnectHandle(handle) {
    
  }

  // 移除消息处理器
  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  // 设置连接处理器
  setConnectHandler(handler) {
    this.connectHandler = handler;
  }

  // 设置错误处理器
  setErrorHandler(handler) {
    this.errorHandler = handler;
  }
}

// 创建单例
const mqttService = new MQTTService();

export default mqttService;
