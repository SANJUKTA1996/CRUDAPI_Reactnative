import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button,Modal, TextInput } from 'react-native';

function App() {
  const [data, setData] = useState([]);
  const[showModal,setShowModal]=useState(false);
  const[selectedUser,setSelectedUser]=useState(undefined)

  const getAPIData = async () => {
    let url = "http://10.0.2.2:3000/users";

    const response = await fetch(url);
    const result = await response.json();
    if (result) {
      setData(result);
    }
  };

  const deleteUser = async (id) => {
    let url = "http://10.0.2.2:3000/users";
    const response = await fetch(`${url}/${id}`, {
      method: "delete"
    });
    const result = await response.json();
    if (result) {
      console.warn("userDelete");
      getAPIData();
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);
  const updateUser=(data)=>{
    setShowModal(true);
    setSelectedUser(data);
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.dataWrapper}>
        <View style={{ flex: 1 }}>
          <Text>Name</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>Age</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 1 }}>Operation</Text>
        </View>
      </View>
      {data.length ? (
        data.map((item) => (
          <View style={styles.dataWrapper} key={item.id}>
            <View style={{ flex: 1 }}>
              <Text>{item.name}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>{item.age}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Delete" onPress={() => deleteUser(item.id)} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Update" onPress={()=>updateUser(item)} />
            </View>
          </View>
        ))
      ) : null}
      <Modal visible={showModal} transparent={true}>
<UserModal   setShowModal={setShowModal} selectedUser={selectedUser} getAPIData={getAPIData}/>
      </Modal>
    </View>
  );
}
const UserModal=(props)=>{
  console.warn(props.selectedUser);
  const [name,setName]=useState(undefined);
  const [age,setAge]=useState(undefined);
  const [email,setEmail]=useState(undefined);
  useEffect(()=>{
    if(props.selectedUser)
    setName(props.selectedUser.name);
    setAge(props.selectedUser.age.toString());
    setEmail(props.selectedUser.email);

  },[props.selectedUser])
  const updateUser= async()=>{
    console.warn(name,age,email,props.selectedUser.id);
    let url = "http://10.0.2.2:3000/users";
    const id=props.selectedUser.id;

    const response = await fetch(`${url}/${id}`,{
      method:'PUT',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,age,email})
    });
    const result=await response.json();
    if(result)
    {
     console.warn(result); 
     props.getAPIData();
     props.setShowModal(false);
    }
  }
  return(
  <View style={styles.centeredView}>
  <View style={styles.modalView}>
    {/* <Text>{props.selectedUser.name}</Text> */}
    <TextInput style={styles.input} value={name} onChangeText={(text)=>setName(text)}/>
    <TextInput style={styles.input} value={age} onChangeText={(text)=>setAge(text)}/>
    <TextInput style={styles.input} value={email} onChangeText={(text)=>setEmail(text)}/>
    <View style={{marginBottom:10}}>

    <Button title="save" onPress={updateUser}/>
    </View>
    <Button title="close" onPress={()=>props.setShowModal(false)}/>
  </View>
</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'orange',
    margin: 5,
    padding: 8
  },
  centeredView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',

  },
  modalView:{
    backgroundColor:'#fff',
    padding:50,
    borderRadius:10,
    shadowColor:'#000',
    shadowOpacity:0.70,
    elevation:5
  },
  input:{
    backgroundColor:'gray',
    borderWidth:2,
    borderColor:'skyblue',
    height:40,
    width:230,
    marginBottom:10,
    borderRadius:10,
    textAlign:'center'

  }

});

export default App;
