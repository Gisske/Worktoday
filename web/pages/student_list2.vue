<template>
    <v-app>
        <!-- App Bar -->
        <v-app-bar color="#00a3ff" elevation="2">
          <template v-slot:prepend>
            <div class="rounded-circle d-flex justify-center align-center"
              style="background-color: white; width: 40px; height: 40px;">
              <v-icon color="blue darken-3" size="24">mdi-arrow-left</v-icon>
            </div>
          </template>
          <v-app-bar-title class="text-white">Student List</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text color="white">
                Sort by time <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item value="newest">
                <v-list-item-title>Newest First</v-list-item-title>
              </v-list-item>
              <v-list-item value="oldest">
                <v-list-item-title>Oldest First</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
      
        <!-- Main Content -->
        <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
        <v-container class="pa-4">
          <div class="mb-6 text-h5 text-center font-weight-bold text-indigo">
            E1 Information Technology Class
          </div>
  
          <div class="text-center text-subtitle-1 mb-3">
            Advisor: Teacher Kritsana Naewwises
          </div>
  
          <v-row dense>
            <v-col v-for="(item, index) in activities" :key="index" cols="12" md="6">
              <v-card class="mb-4" outlined>
                <v-card-title>
                  <v-avatar size="48" class="mr-3">
                    <v-img :src="`http://localhost:7000/uploads/profile/${item.picture}`"></v-img>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold text-indigo darken-4">{{ item.username }}</div>
                    <div class="text-muted">{{ item.student_id }}</div>
                  </div>
                </v-card-title>
  
                <v-card-subtitle class="text-right text-caption">
                  {{ item.time }}
                  <span v-if="item.attendance !== undefined" class="ml-2">({{ item.attendance }})</span>
                </v-card-subtitle>
  
                <v-card-actions>
                  <v-menu location="bottom end">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="cursor-pointer">mdi-dots-horizontal</v-icon>
                    </template>
                    <v-list>
                      <v-list-item v-for="(option, i) in attendanceOptions" :key="i" @click="updateAttendance(index, option.value)">
                        <v-list-item-title>{{ option.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
  
          <v-btn @click="submitAttendance" color="indigo darken-3" class="mx-auto d-block mt-6">
            Submit Attendance
          </v-btn>
        </v-container>
      </v-main>
      
        <!-- Bottom Navigation -->
        <v-bottom-navigation grow color="#00a3ff">
          <v-btn value="home" text>
            <v-icon>mdi-home</v-icon>
            Home
          </v-btn>
          <v-btn value="chat" text>
            <v-icon>mdi-chat</v-icon>
            Chat
          </v-btn>
          <v-btn value="mail" text>
            <v-icon>mdi-email</v-icon>
            Mail
          </v-btn>
          <v-btn value="profile" text>
            <v-icon>mdi-account</v-icon>
            Profile
          </v-btn>
        </v-bottom-navigation>
      </v-app>
      
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const attendanceOptions = [
    { text: 'ขาด', value: 3 },
    { text: 'ลา', value: 4 },
    { text: 'มา', value: 1 },
    { text: 'สาย', value: 2 }
]

const activities = ref([
    {
        name: 'Claudia Alves',
        action: 'Commented on your post.',
        time: '3m ago',

    },
    {
        name: 'Claudia Alves',
        action: 'Liked your photo.',
        time: '5m ago',

    },
    {
        name: 'Claudia Alves',
        action: 'Mentioned you in a comment.',
        time: '2h ago',

    },
    {
        name: 'Dani Martinez',
        action: 'Shared your post.',
        time: '3h ago',

    },
    {
        name: 'Kimberly Nguyen',
        action: 'Commented on your photo.',
        time: '5h ago',

    },
    {
        name: 'Kimberly Nguyen',
        action: 'Started following you.',
        time: '7h ago',

    },
    {
        name: 'Mariana Napolitani',
        action: 'Saved your photo.',
        time: 'Yesterday',

    }
])

// ฟังก์ชันสำหรับการดึงข้อมูลจาก API
const listData = async () => {
    try {
        const response = await axios.get('http://localhost:7000/listStudent')
        const result = await response.data;
        console.log('listData = ', result);
        activities.value = result.datas
        
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

// โหลดข้อมูลเมื่อคอมโพเนนต์ถูก mount
onMounted(() => {
    listData()
})

const updateAttendance = async (index, value) => {
    activities.value[index] = {
        ...activities.value[index],
        attendance: value
    }
    // เตรียมข้อมูลที่จะส่งไปที่ API
    const payload = {
        studentName: activities.value[index].username,
        student_id: activities.value[index].student_id,
        attendance: value,
        time: activities.value[index].password
    }
    console.log('data=', payload)
}


// ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม Submit เพื่อส่งข้อมูลทั้งหมดไปยัง API
const submitAttendance = async () => {
    // เตรียมข้อมูลที่จะส่งไปที่ API
    const payload = activities.value.map(activity => ({
        studentName: activity.username,
        student_id: activity.student_id,
        attendance: activity.attendance,
        time: activity.password
    }))

    try {
        // ส่งข้อมูลไปที่ API ด้วย axios
        const response = await axios.post("http://localhost:7000/check2", {  payload })
        console.log('API Response:', response.data)
    } catch (error) {
        console.error('Error sending data to API:', error)
    }
}

</script>

<style scoped>
/* App Bar */
.v-app-bar {
    background: linear-gradient( #00a3ff);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease, background-color 0.3s ease;
    border-radius: 0 0 20px 20px;
  }
  
  .v-app-bar:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(#00a3ff);
  }
  
  /* Buttons */
  .v-btn {
    background: linear-gradient(#00a3ff);
    color: white !important;
    border-radius: 50px;
    padding: 14px 28px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }
  
  .v-btn::before {
    content: "";
    position: absolute;
    width: 300%;
    height: 300%;
    top: 50%;
    left: 50%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  
  .v-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    background: linear-gradient(#00a3ff);
  }
  
  .v-btn:hover::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .v-btn:active {
    transform: scale(0.98);
  }
  
  /* List Items */
  .v-list-item {
    background: linear-gradient(#00a3ff);
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 16px 24px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }
  
  .v-list-item:hover {
    transform: translateY(-8px);
    background: linear-gradient(#00a3ff);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  /* Avatar */
  .v-avatar {
    border: 4px solid #00a3ff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .v-avatar:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }
  
  /* Bottom Navigation */
  .v-bottom-navigation {
    background: linear-gradient(#00a3ff);
    color: white;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .v-bottom-navigation .v-btn {
    background: none;
    box-shadow: none;
    transition: transform 0.3s ease, color 0.3s ease;
  }
  
  .v-bottom-navigation .v-btn:hover {
    transform: translateY(-3px);
    color: #00a3ff;
  }
  
  /* Text */
  .text-grey-darken-1 {
    color: #00a3ff;
    font-size: 1.15rem;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  .text-subtitle-2 {
    font-weight: 500;
    font-size: 1.15rem;
    color: #00a3ff;
  }
  
  /* Global Enhancements */
  body {
    background: linear-gradient(180deg, #f4f7fb, #f0f4f8);
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  ::selection {
    background: #00a3ff;
    color: white;
  }
  
  a {
    color: #00a3ff;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #00a3ff;
  }
  
  .v-card {
    border-radius: 15px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  
  .v-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  /* Container and Flexbox Enhancements */
  .v-main {
    position: relative;
    margin-top: 100px;
    margin-bottom: 100px;
    padding: 30px;
  }
  
  .v-container {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .v-container .text-subtitle-2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #00a3ff;
    margin-bottom: 20px;
  }
  
  .v-list-item-title {
    font-size: 1.25rem;
    color: #00a3ff;
    font-weight: 500;
  }
  
  .v-list-item-subtitle {
    font-size: 1rem;
    color: #7f8c8d;
    font-weight: 400;
  }
  
  .d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .text-caption {
    font-size: 0.9rem;
    color: #95a5a6;
  }
  
  .text-blue-darken-2 {
    color: #00a3ff;
  }
  
  /* Hover Effects for Menu */
  .v-menu .v-list-item {
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .v-menu .v-list-item:hover {
    background-color: #00a3ff;
    transform: translateX(5px);
  }
  
  /* Add More Smooth Transitions */
  .v-list-item,
  .v-btn,
  .v-avatar,
  .v-card {
    transition: all 0.3s ease-in-out;
  }
  
</style>