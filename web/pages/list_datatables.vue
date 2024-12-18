<template>
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]">
      <template v-slot:top>
          <v-toolbar flat>
              <v-toolbar-title>รายละเอียดสมาชิก</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ props }">
                      <v-btn class="mb-2" color="primary" dark v-bind="props">
                          เพิ่มสมาชิก
                      </v-btn>
                  </template>
                  <v-card>
                      <v-card-title>
                          <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
  
                      <v-card-text>
                          <v-container>
                              <v-row>
                                  <v-col cols="12" md="4" sm="6">
                                      <v-text-field v-model="editedItem.student_id" label="ลำดับ"></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="4" sm="6">
                                    <v-text-field v-model="editedItem.fullname" label="ชื่อนักเรียน"></v-text-field>
                                </v-col>
                                  <v-col cols="12" md="4" sm="6">
                                      <v-text-field v-model="editedItem.username" label="สมาชิก"></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="4" sm="6">
                                      <v-text-field v-model="editedItem.password" label="รหัส"></v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="4" sm="6">
  
                                      <v-file-input v-model="editedItem.picture" label="อัปโหลด" accept="image/*"></v-file-input>
  
                                  </v-col>
                              </v-row>
                          </v-container>
                      </v-card-text>
  
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue-darken-1" variant="text" @click="close">
                              ยกเลิก
                          </v-btn>
                          <v-btn color="blue-darken-1" variant="text" @click="save">
                              ยืนยัน
                          </v-btn>
                      </v-card-actions>
                  </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                      <v-card-title class="text-h5">คุณต้องการลบข้อมูลใช่หรือไม่</v-card-title>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                  </v-card>
              </v-dialog>
          </v-toolbar>
      </template>
  
      <template v-slot:item.picture="{ item }">
        <v-img :src="'http://localhost:7000/uploads/profile/' + item.picture" max-width="100px" max-height="100px"></v-img>
    </template>
    
  
      <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
              mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)">
              mdi-delete
          </v-icon>
      </template>
      <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
              Reset
          </v-btn>
      </template>
  </v-data-table>
  </template>
  
  <script>
  import axios from "axios";
  export default {
      data: () => ({
          dialog: false,
          dialogDelete: false,
          headers: [{
                  title: "student_id",
                  align: "start",
                  sortable: false,
                  key: "student_id",
              },
              {
                  title: "fullname",
                  key: "fullname"
              },
              {
                  title: "username",
                  key: "username"
              },
              {
                  title: "password",
                  key: "password"
              },
              {
                  title: "picture",
                  key: "picture"
              },
              {
                  title: "Actions",
                  key: "actions",
                  sortable: false
              },
          ],
          desserts: [],
          editedIndex: -1,
          editedItem: {
              student_id: "",
              fullname: "",
              username: "",
              password: "",
              picture: "",
          },
          defaultItem: {
              student_id: "",
              fullname: "",
              username: "",
              password: "",
              picture: "",
          },
      }),
  
      computed: {
          formTitle() {
              return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
          },
      },
  
      watch: {
          dialog(val) {
              val || this.close();
          },
          dialogDelete(val) {
              val || this.closeDelete();
          },
      },
  
      created() {
          this.initialize();
          this.listData();
      },
  
      methods: {
          initialize() {
              this.desserts = [{
                      student_id: "",
                      fullname: "",
                      username: "",
                      password: "",
                      picture: "",
                  },
                  {
                      student_id: "",
                      fullname: "",
                      username: "",
                      password: "",
                      picture: "",
                  },
              ];
          },
  
          async listData() {
            const respones = await axios.get("http://localhost:7000/listStudent");
            const datas = respones.data;
            console.log(" datas = ", datas);
            this.desserts = datas.datas;
          },
  
          editItem(item) {
              console.log('edit ', this.editedItem);
              this.editedIndex = this.desserts.indexOf(item);
              this.editedItem = Object.assign({}, item);
              this.dialog = true;
          },
  
          async deleteItem(item) {
              let id = item.student_id;
              console.log("item = ", id);
              try {
                  const response = await axios.post(
                      "http://localhost:7000/deleteStudent", {
                          student_id: id
                      }
                  );
                  const status = response.data;
  
                  console.log("status = ", status);
                  if (status.status === 1) {
                      console.log("delete ok");
                  }
                  if (status.status === 0) {
                      console.log("error delete");
                  }
              } catch (e) {
                  console.log(e.message);
              }
  
              this.dialogDelete = true;
          },
  
          deleteItemConfirm() {
              this.closeDelete();
          },
  
          close() {
              this.dialog = false;
              this.$nextTick(() => {
                  this.editedItem = Object.assign({}, this.defaultItem);
                  this.editedIndex = -1;
              });
          },
  
          closeDelete() {
              this.dialogDelete = false;
              this.$nextTick(() => {
                  this.editedItem = Object.assign({}, this.defaultItem);
                  this.editedIndex = -1;
              });
          },
  
          async save() {
            console.log("save = ", this.editedItem);

// Create FormData for handling data and image uploads
const formData = new FormData();
formData.append("student_id", this.editedItem.student_id);
formData.append("fullname", this.editedItem.fullname);
formData.append("username", this.editedItem.username);
formData.append("password", this.editedItem.password);

// If picture is a file (uploaded), include it
if (this.editedItem.picture instanceof File) {
    formData.append("picture", this.editedItem.picture);
}

if (this.editedIndex > -1) {
    // Update existing data
    try {
        const response = await axios.post(
            "http://localhost:7000/updateMember",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        const status = response.data;
        console.log("status = ", status);
        if (status.status === 1) {
            console.log("update ok");
        } else {
            console.log("error update");
        }
    } catch (e) {
        console.error(e.message);
    }
              } else {
                  // Add data
                  try {
                      const response = await axios.post(
                          "http://localhost:7000/insertStudent",
                          this.editedItem
                      );
                      const status = response.data;
  
                      console.log("status = ", status);
                      if (status.status === 1) {
                          console.log("insert ok");
                      }
                      if (status.status === 0) {
                          console.log("error insert");
                      }
                  } catch (e) {
                      console.log(e.message);
                  }
                  try {
                      const response = await axios.post('http://localhost:7000/upload-single', this.editedItem, {
                          headers: {
                              'Content-Type': 'multipart/form-data'
                          }
                      });
                      console.log('Response:', response.data);
                      alert(response.data.message);
                  } catch (error) {
                      console.error('Upload single file error:', error);
                  }
              }
              this.close();
          },
          
      },
  };
  </script>

  <style>
  /* Global Styles */
body {
    background: #f5f5f5;
    font-family: 'Roboto', sans-serif;
    color: #333;
    padding: 20px;
  }
  
  /* Button Styling */
  .v-btn {
    transition: all 0.3s ease-in-out;
  }
  
  .v-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Data Table Styling */
  .v-data-table {
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 30px;
    overflow: hidden;
  }
  
  .v-data-table th {
    background-color: #3f51b5;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .v-data-table td {
    font-size: 14px;
    color: #555;
    transition: background-color 0.3s ease-in-out;
  }
  
  .v-data-table td:hover {
    background-color: #f0f0f0;
  }
  
  .v-data-table .v-data-table_wrapper {
    padding: 20px;
  }
  
  /* Hover effect for actions icons */
  .v-icon {
    transition: transform 0.3s ease-in-out;
  }
  
  .v-icon:hover {
    transform: scale(1.2);
    color: #3f51b5;
    cursor: pointer;
  }
  
  /* Dialog Styles */
  .v-dialog {
    transition: all 0.4s ease-in-out;
  }
  
  .v-dialog-enter-active,
  .v-dialog-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .v-dialog-enter, .v-dialog-leave-to {
    opacity: 0;
    transform: translateY(-50px);
  }
  
  .v-card {
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .v-card-title {
    background: #3f51b5;
    color: white;
    padding: 20px;
    border-radius: 10px 10px 0 0;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  
  .v-card-actions {
    padding: 15px;
    background: #f5f5f5;
    border-radius: 0 0 10px 10px;
  }
  
  /* Form Styling */
  .v-text-field {
    margin-bottom: 20px;
  }
  
  .v-file-input {
    margin-bottom: 20px;
  }
  
  /* Custom table row hover effect */
  .v-data-table__wrapper tr:hover {
    background-color: #e1f5fe;
    transform: translateX(5px);
  }
  
  /* Styling for image */
  .v-img {
    transition: transform 0.3s ease-in-out;
    border-radius: 20px;
    margin: 20px;
  }
  
  /* Custom Dialog Buttons */
  .v-btn:focus {
    box-shadow: none;
    outline: none;
  }
  
  .v-btn.color-blue-darken-1 {
    background-color: #3f51b5;
    color: white;
    transition: background-color 0.3s ease;
  }
  
  .v-btn.color-blue-darken-1:hover {
    background-color: #1a237e;
  }
  
  /* Floating action button effect */
  .v-btn.v-btn--fab {
    transition: transform 0.3s ease;
  }
</style>