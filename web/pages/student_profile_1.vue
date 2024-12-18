<template>
  <v-app>
    <v-app-bar 
      color="#007bff" 
      height="25vh"
      class="rounded-b-xl"
      elevation="0"
    >
      <v-btn 
        icon="mdi-arrow-left" 
        color="white" 
        class="back-button"
      ></v-btn>
      
      <div class="profile-section">
        <div class="text-center">
          <div class="text-h6 text-white mb-6">Student Profile</div>
          
          <v-avatar 
            size="80" 
            class="mb-4 white"
          >
            <v-img
              :src="selectedImage"
              alt="Profile Picture"
              cover
            ></v-img>

            <!-- เพิ่ม input type file แบบซ่อน -->
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="onFileSelected"
              style="display: none"
            >

            <!-- ปุ่มแก้ไขที่จะเรียก input file -->
            <v-dialog v-model="isDialogOpen" max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                icon="mdi-pencil"
                size="small"
                class="avatar-edit-btn"
                color="white"
                variant="flat"
              ></v-btn>
            </template>

            <v-card title="แก้ไขรูปโปรไฟล์">
              <v-container>
                <v-form @submit.prevent="uploadSingleFile">
                  <v-file-input
                    v-model="singleFile"
                    label="อัพโหลด"
                    accept="image/*"
                    required
                    @change="previewSingleFile"
                  ></v-file-input>

                  <!-- แสดงตัวอย่างภาพ -->
                  <!-- <v-img v-if="singleFilePreview" :src="singleFilePreview" max-width="200" max-height="200" class="my-4"></v-img> -->
                </v-form>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red-lighten-2" text @click="isDialogOpen = false">ปิด</v-btn>
                  <v-btn color="primary" text @click="save">บันทึก</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
            
          </v-avatar>
          
          <div class="white--text text-h6 mb-1">{{fullname}}</div>
          <div class="white--text text-subtitle-2">{{username}}</div>
        </div>
      </div>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <!-- General Settings Section -->
        <div class="text-subtitle-1 mb-2">General Settings</div>
        <v-card flat class="mb-4">
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-theme-light-dark</v-icon>
              </template>
              <v-list-item-title>Mode</v-list-item-title>
              <v-list-item-subtitle>Dark & Light</v-list-item-subtitle>
              <template v-slot:append>
                <v-switch color="primary"></v-switch>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-key</v-icon>
              </template>
              <v-list-item-title>Change Password</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-translate</v-icon>
              </template>
              <v-list-item-title>Language</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Information Section -->
        <div class="text-subtitle-1 mb-2">Information</div>
        <v-card flat>
          <v-list>
            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              <v-list-item-title>About App</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-file-document</v-icon>
              </template>
              <v-list-item-title>Terms & Conditions</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-shield-check</v-icon>
              </template>
              <v-list-item-title>Privacy Policy</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-share-variant</v-icon>
              </template>
              <v-list-item-title>Share This App</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// import profileImage from '@/assets/images/profile1.png' // แก้ชื่อไฟล์ตามที่คุณมี
import axios from 'axios'
import { ref, onMounted } from 'vue'  // นำเข้าเพียงครั้งเดียว
import defaultImage from '@/assets/images/profile2.png' // รูปเริ่มต้น
import { useRouter } from 'vue-router'

const isDialogOpen = ref(false)
const userData = ref('')
const fullname = ref('')
const username = ref('')
const singleFile = ref(null)
const singleFilePreview = ref(null)
const selectedImage = ref(defaultImage)
// ref สำหรับ input file
const fileInput = ref(null)

const save = () => {
  uploadSingleFile()
  isDialogOpen.value = false
}

const uploadSingleFile = async () => {
  if (singleFile.value) {
    const formData = new FormData();
    formData.append('picture', singleFile.value);
    formData.append('username', username.value);

    try {
        const response = await axios.post('http://localhost:7000/upload-single', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Response:', response.data);
        alert(response.data.message);
        listProfile();
        
        // รีเซ็ตค่าหลังการอัปโหลด
        singleFile.value = null;
        singleFilePreview.value = null;
    } catch (error) {
        console.error('Upload single file error:', error);
    }
  }
}


const listProfile = async () => {
  try {
      const response = await axios.get('http://localhost:7000/listStudent');
      userData.value = response.data.datas;
      fullname.value = userData.value[0].fullname;
      username.value = userData.value[0].username
      selectedImage.value = `http://localhost:7000/uploads/profile/${userData.value[0].picture}`;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

const previewSingleFile = (event) => {
  singleFilePreview.value = URL.createObjectURL(event)
}

// โหลดข้อมูลเมื่อคอมโพเนนต์โหลดเสร็จ
const router = useRouter()
onMounted(() => {
  listProfile();
  const token = localStorage.getItem('token') // หรือเปลี่ยนเป็น sessionStorage.getItem('token') ตามที่ใช้
  if (!token) {
    alert('โปรดไป login ก่อน')
    router.push({ path: '/login' })
  }
});

// ฟังก์ชันเมื่อเลือกไฟล์
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    // สร้าง URL สำหรับไฟล์ที่เลือก
    const imageUrl = URL.createObjectURL(file)
    selectedImage.value = imageUrl
    
    // ถ้าต้องการส่งไฟล์ไปที่เซิร์ฟเวอร์
    uploadImage(file)
  }
}

// ถ้าต้องการอัพโหลดไฟล์ไปที่เซิร์ฟเวอร์
const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    // ส่งไฟล์ไปที่เซิร์ฟเวอร์
    const response = await axios.post('http://localhost:7000/upload-single', formData)
    selectedImage.value = response.data.imageUrl
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}
</script>


<style scoped>
/* ปุ่มย้อนกลับ */
.back-button {
position: absolute;
top: 16px;
left: 16px;
z-index: 1;
padding: 8px 16px;
background: linear-gradient(45deg, #007bff, #00d4ff);
border-radius: 50px;
color: white;
font-weight: bold;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.back-button:hover {
transform: scale(1.1);
box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* ส่วนโปรไฟล์ */
.profile-section {
width: 100%;
padding-top: 2rem;
animation: fade-in 1s ease-in-out;
}
@keyframes fade-in {
from {
  opacity: 0;
  transform: translateY(20px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

/* ปุ่มแก้ไข Avatar */
.edit-button-wrapper {
position: relative;
width: 80px;
margin: -24px auto 16px;
}
.avatar-edit-btn {
position: absolute;
right: -5px;
bottom: 0;
background: linear-gradient(90deg, #0158c8, #00a3ff);
border: 2px solid white;
padding: 6px 12px;
border-radius: 50px;
cursor: pointer;
z-index: 1;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
transition: background 0.3s ease, transform 0.3s ease;
}
.avatar-edit-btn:hover {
background: linear-gradient(90deg, #00a3ff, #0158c8);
transform: scale(1.1);
}

/* ส่วนหลัก */
.v-main {
padding-top: calc(25vh + 16px) !important;
background: linear-gradient(180deg, #e8f7ff, #f5f5f5);
animation: background-shift 10s infinite alternate;
}
@keyframes background-shift {
0% {
  background: linear-gradient(180deg, #e8f7ff, #f5f5f5);
}
100% {
  background: linear-gradient(180deg, #f5f5f5, #e8f7ff);
}
}

/* ข้อความสีขาว */
.white--text,
.text-white {
color: white !important;
font-weight: bold;
text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

/* Avatar */
.v-avatar.white {
background: linear-gradient(135deg, #e8f7ff, #d3e8ff);
border: 2px solid #00a3ff;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.v-avatar.white:hover {
transform: scale(1.05);
box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* Container */
.v-container {
max-width: 100%;
width: 100%;
padding: 16px;
animation: slide-in 1s ease;
}
@keyframes slide-in {
from {
  opacity: 0;
  transform: translateX(-20px);
}
to {
  opacity: 1;
  transform: translateX(0);
}
}

/* ปุ่ม Hover */
button {
font-size: 1rem;
padding: 10px 20px;
background: linear-gradient(45deg, #007bff, #00a3ff);
color: white;
border: none;
border-radius: 50px;
cursor: pointer;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
transition: transform 0.3s ease, box-shadow 0.3s ease;
}
button:hover {
transform: scale(1.05);
box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

</style>