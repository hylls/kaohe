<template>
  <div class="mqtt-demo">
    <h2>MQTT Demo</h2>

    <div class="status">
      <div>
        连接状态:
        <span :class="connectionStatusClass">{{ connectionStatus }}</span>
      </div>

      <div style="margin-top: 20px">
        <el-button @click="connect" :disabled="isConnected">连接</el-button>

        <el-button @click="disConnect" type="danger" :disabled="!isConnected"
          >断开连接</el-button
        >
      </div>

      <el-form style="margin-top: 20px" :model="mqttForm" label-width="auto">
        <el-form-item label="主题">
          <el-input @input="mqttForm.subscribeTopic = mqttForm.subscribeTopic.trim()" style="width: 200px" v-model="mqttForm.subscribeTopic" />
          <el-button @click="subscribe" style="margin-left: 20px" type="primary"
            >订阅</el-button
          >
        </el-form-item>
      </el-form>

      <div class="subscribeTable">
        <el-table
          v-if="subscribeList && subscribeList.length"
          :data="subscribeList"
        >
          <el-table-column fixed prop="date" label="时间" width="180" />
          <el-table-column prop="topic" label="主题" width="180" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                @click="handleUnsubscribe(scope.$index, scope.row)"
              >
                取消订阅
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else />
      </div>
    </div>

    <div class="messages">
      <h3>订阅消息:</h3>
      <!-- <ul>
        <li v-for="(msg, index) in receivedMessages" :key="index">
          {{ msg }}
        </li>
      </ul> -->
      <div class="table">
        <el-table
          v-if="receivedMessages.length"
          :data="receivedMessages"
          style="width: 100%"
          height="300px"
        >
          <el-table-column fixed prop="date" label="时间" width="180" />
          <el-table-column prop="topic" label="主题" width="180" />
          <el-table-column prop="message" label="消息" />
        </el-table>
        <el-empty v-else />
      </div>
    </div>

    <div class="send-message">
      <h3>发布消息:</h3>
      <el-form :model="mqttForm" label-width="auto">
        <el-form-item label="主题">
          <el-input style="width: 200px" v-model="mqttForm.publishTopic" />
        </el-form-item>
      </el-form>
      <input
        style="width: 360px"
        v-model="messageToSend"
        placeholder="输入消息"
      />
      <button @click="sendMessage" :disabled="!isConnected">发送</button>

      <div class="publish-table">
        <el-table
          v-if="publishMessages.length"
          :data="publishMessages"
          style="width: 100%"
          height="300px"
        >
          <el-table-column fixed prop="date" label="时间" width="180" />
          <el-table-column prop="topic" label="主题" width="180" />
          <el-table-column prop="message" label="消息" />
        </el-table>
        <el-empty v-else />
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  inject,
  reactive,
} from "vue";
import { MQTT_CONFIG } from "../utils/service";
import moment from "moment";

export default {
  name: "MqttDemo",
  setup() {
    const mqttForm = reactive({
      subscribeTopic: MQTT_CONFIG.subscribeTopic,
      publishTopic: MQTT_CONFIG.publishTopic,
    });

    const mqttService = inject("mqttService");
    const subscribeList = ref([...mqttService.subscribeList]);

    const isConnected = ref(false);
    const receivedMessages = ref([]);
    const publishMessages = ref([]);
    const messageToSend = ref("");

    const connectionStatus = ref("Disconnected");
    const connectionStatusClass = ref("disconnected");

    const subscribe = () => {
      mqttService.subscribe(mqttForm.subscribeTopic);
      if (
        !subscribeList.value.find((s) => s.topic === mqttForm.subscribeTopic)
      ) {
        subscribeList.value.push({
          topic: mqttForm.subscribeTopic,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
      }
    };

    const handleUnsubscribe = (_, row) => {
      console.log(row);
      mqttService.unsubscribe(row.topic)
      subscribeList.value = subscribeList.value.filter(s => s.topic !== row.topic);
    }

    // 处理接收到的消息
    const handleMessage = (topic, message) => {
      receivedMessages.value.push({
        date: `${new Date().toLocaleTimeString()}`,
        topic,
        message,
      });
      if (receivedMessages.value.length > 10) {
        receivedMessages.value.shift();
      }
    };

    // 处理连接状态变化
    const handleConnect = () => {
      isConnected.value = true;
      connectionStatus.value = "Connected";
      connectionStatusClass.value = "connected";
    };

    // 处理不连接状态变化
    const handleDisConnect = () => {
      isConnected.value = false;
      connectionStatus.value = "Disconnected";
      connectionStatusClass.value = "disconnected";
    };

    // 处理错误
    const handleError = (error) => {
      console.error("MQTT error:", error);
      isConnected.value = false;
      connectionStatus.value = "Error: " + error.message;
      connectionStatusClass.value = "error";
    };

    onMounted(() => {
      // 添加消息处理器
      mqttService.addMessageHandler(handleMessage);
      mqttService.setConnectHandler(handleConnect);
      mqttService.setErrorHandler(handleError);

      // 尝试连接
      if (!mqttService.client || !mqttService.client.connected) {
        mqttService
          .connect()
          .then(() => {
            mqttService.subscribe(mqttForm.subscribeTopic);
          })
          .catch((err) => {
            //   handleConnect()
            console.log(err);
          });
      } else {
        handleConnect();
      }
    });

    onBeforeUnmount(() => {
      // 清理
      mqttService.removeMessageHandler(handleMessage);
      mqttService.setConnectHandler(null);
      mqttService.setErrorHandler(null);
    });

    // 发送消息
    const sendMessage = () => {
      if (messageToSend.value.trim()) {
        mqttService.publish(mqttForm.publishTopic, messageToSend.value);
        publishMessages.value.push({
          date: `${new Date().toLocaleTimeString()}`,
          topic: mqttForm.publishTopic,
          message: messageToSend.value,
        });
        if (publishMessages.value.length > 10) {
          publishMessages.value.shift();
        }
        messageToSend.value = "";
      }
    };

    const connect = () => {
      mqttService.connect(mqttForm.subscribeTopic).catch((err) => {
        handleError();
      });
    };

    const disConnect = () => {
      mqttService.disconnect();
      isConnected.value = false;
      connectionStatus.value = "Disconnected";
      connectionStatusClass.value = "disconnected";
    };

    return {
      isConnected,
      receivedMessages,
      messageToSend,
      connectionStatus,
      connectionStatusClass,
      sendMessage,
      connect,
      disConnect,
      mqttForm,
      publishMessages,
      subscribe,
      subscribeList,
      handleUnsubscribe
    };
  },
};
</script>

<style lang="less" scoped>
.mqtt-demo {
  //   margin: 0 auto;
  font-family: Arial, sans-serif;
  max-width: 70%;

  .btn-input {
    cursor: pointer;
    color: white;
    font-weight: 600;
    padding: 0.7rem 2rem;
    border-radius: 0.4rem;
    background-color: #41b883;
  }
}

.status span {
  padding: 2px 5px;
  border-radius: 3px;
}

.status .connected {
  background-color: #4caf50;
  color: white;
}

.status .disconnected {
  background-color: #f44336;
  color: white;
}

.status .error {
  background-color: #ff9800;
  color: white;
}

.messages {
  margin: 20px 0;
  border: 1px solid #ddd;
  padding: 10px;

  .table {
    // height: 300px;
    // height: 200px;
    overflow-y: auto;
  }
}
.send-message {
  margin-top: 20px;

  .publish-table {
    margin: 20px 0;
    border: 1px solid #ddd;
    padding: 10px;
    overflow-y: auto;
  }
}

.send-message input {
  padding: 8px;
  width: 70%;
  margin-right: 10px;
}

.send-message button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.send-message button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
