<template>
  <v-app>
    <v-app-bar app color="transparent" elevation="0">
      <v-app-bar-nav-icon color="white">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-main class="login-background d-flex flex-column">
      <v-container fluid fill-height class="pa-0 flex-grow-1">
        <v-row no-gutters class="fill-height flex-column justify-center">
          <v-col class="d-flex flex-column align-center">
            <div class="circular-image mb-4">
              <!-- <v-icon icon="mdi-account" color="white" size="40"></v-icon> -->
              <!-- <v-img
                src="/path/to/student-cartoon-image.png"
                alt="Student Cartoon"
                width="100%"
                height="100%"
                cover
              ></v-img> -->
            </div>
            <div class="text-wrapper mb-6">
              <div class="student-text font-weight-bold">student</div>
              <div class="check-app-text">CHECK APP</div>
            </div>
            <v-text-field
              v-model="email"
              label="Email or Phone"
              variant="outlined"
              color="white"
              bg-color="transparent"
              class="custom-text-field rounded-textfield"
              rounded="lg"
              width="100%"
              max-width="400"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-account" color="white"></v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              variant="outlined"
              color="white"
              bg-color="transparent"
              type="password"
              class="custom-text-field rounded-textfield"
              rounded="lg"
              width="100%"
              max-width="400"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-lock" color="white"></v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-card class="white-card custom-rounded-top" elevation="0" width="100%">
        <v-card-text class="custom-padding">
          <div class="text-center mb-4">
            <router-link to="/forgot_pass" class="forgot-password-link">Forgot Password?</router-link>
          </div>
          <v-btn color="#4c8479" @click="Login" rounded="pill" class="login-btn mb-4"  block size="x-large">
            <span class="white--text" >Login</span>
          </v-btn>
          <div class="text-center mb-4">or</div>
          <v-btn color="#bed2d0" rounded="pill" class="create-account-btn mb-4" block size="x-large">
            <router-link to="/account2"><span class="create-account-text">Create an account</span></router-link>
          </v-btn>
          <div class="d-flex justify-center">
            <v-avatar color="#1877F2" size="large" class="mx-2 clickable-avatar" @click="loginWithFacebook">
              <v-icon icon="mdi-facebook" color="white" size="large"></v-icon>
            </v-avatar>
            <v-avatar color="#DB4437" size="large" class="mx-2 clickable-avatar" @click="loginWithGmail">
              <v-icon icon="mdi-google" color="white" size="large"></v-icon>
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

 
<script>
// import { ref } from 'vue'
import axios from "axios"
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },

  methods: { 
  async Login() {
    console.log('email=', this.email);
    const forms = {
      username: this.email,
      password: this.password
    };
    
    try {
      const response = await axios.post("http://localhost:7000/login", forms);
      
      if (response.data.token) {
        // บันทึก Token ลงใน Local Storage
        localStorage.setItem('token', response.data.token);
        
        // Redirect ไปยังหน้า student_profile_1
        this.$router.push('/student_profile_1');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  }
},
}
</script>

<style scoped>

a {
  text-decoration: none;
  transition: color 0.3s ease-in-out;
}
a:hover {
  color: #4ccfff; /* สีฟ้าสว่าง */
}

.login-background {
  background: linear-gradient(90deg, #007bff, #00a3ff); /* ฟ้าสด */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: gradient-shift 10s infinite alternate;
}
@keyframes gradient-shift {
  0% {
    background: linear-gradient(90deg, #007bff, #00a3ff);
  }
  100% {
    background: linear-gradient(90deg, #00a3ff, #007bff);
  }
}

.circular-image {
  width: 240px;
  height: 240px;
  background: linear-gradient(180deg, #4ccfff, #007bff); /* ฟ้าสว่างถึงเข้ม */
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.circular-image:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
}

.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fade-in 1.5s ease;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.student-text {
  font-size: 60px;
  color: #4ccfff; /* ฟ้าสว่าง */
  line-height: 1;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  animation: text-pop 2s infinite alternate;
}
@keyframes text-pop {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.check-app-text {
  font-size: 20px;
  color: white;
  margin-top: -5px;
  animation: slide-in 1.5s ease;
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

.white-card {
  background-color: white !important;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.white-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.forgot-password-link {
  color: #007bff; /* ฟ้า */
  text-decoration: none;
  transition: color 0.3s ease;
}
.forgot-password-link:hover {
  color: #4ccfff; /* ฟ้าสว่าง */
}

.login-btn, .create-account-btn {
  text-transform: none;
  font-size: 1.2rem;
  border-radius: 50px !important;
  background: linear-gradient(90deg, #007bff, #00a3ff); /* ไล่สีฟ้า */
  color: white;
  transition: background 0.3s ease, transform 0.3s ease;
}
.login-btn:hover, .create-account-btn:hover {
  background: linear-gradient(90deg, #00a3ff, #007bff); /* สลับสี */
  transform: scale(1.05);
}

.create-account-text {
  color: #fff; /* ฟ้า */
}

.custom-padding {
  padding-left: 80px !important;
  padding-right: 80px !important;
}

.clickable-avatar {
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s ease;
}
.clickable-avatar:hover {
  opacity: 0.8;
  transform: rotate(10deg);
}

:deep(.custom-text-field) {
  width: 100%;
  max-width: 400px;
}
:deep(.custom-text-field .v-field__outline) {
  --v-field-border-opacity: 1;
  border: 2px solid #4ccfff; /* ฟ้าสว่าง */
  border-radius: 10px;
}
:deep(.custom-text-field .v-label) {
  color: #4ccfff !important; /* ฟ้าสว่าง */
  font-weight: bold;
}
:deep(.custom-text-field input) {
  color: white !important;
}

:deep(.rounded-textfield .v-field__outline) {
  border-radius: 40px;
}

</style>