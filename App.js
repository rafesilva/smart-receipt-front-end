import React from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { ImagePicker, Permissions } from "expo";
import axios from 'axios';
import FormData from 'form-data'
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
    
  constructor() {
   super()
    
    this.state = {

      imageBase64: '',
      image: undefined,
      response: null,
      text: '',
      fontLoaded: false,
      indicator: false,

    }

  }; 

  async componentDidMount() {

     await Font.loadAsync({
      'menu': require('./assets/fonts/EncodeSansCondensed-Regular.ttf'),
      'title': require('./assets/fonts/LibreBarcode39Text-Regular.ttf'),
    })
   
     this.setState({ fontLoaded: true })
  };

  sendIt = () => {
    this.setState({ indicator: true})
    console.log('I will send it', this.state.image);
    
    let data = new FormData();
    let urlapi = 'http://10.0.0.4:8000/file/analysis/'
    data.append('file', this.state.imageBase64, 'image/jpeg')
    data.append('query', this.state.text, 'text')

    axios.post(urlapi, data, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then((response) => {
        this.setState({ response: response.data, indicator: false})
        console.log('Full Response : ', response);
      })
      .catch((error) => {
        console.log('Error : ', error);
      })
  };
  
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  
  };

  pickImage = async () => {
    
    await this.askPermissionsAsync();
    
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,

      })

      this.setState({ imageBase64: result.base64, image: result.uri });
          console.log('Image State : ',this.state.image);
          console.log('Image State Base64 : ',this.state.imageBase64);


  };

  pickCamera = async () => {
    
    this.askPermissionsAsync();
    
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true,

      })

      this.setState({ imageBase64: result.base64, image: result.uri });
        console.log('Image State : ',this.state.image);
        console.log('Image State Base64 : ',this.state.imageBase64);
  };

  render() {
      let image = this.state.image 
      let response = this.state.response

    return (
       <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

        <View style={styles.main}> 
        

          <ScrollView>

            <View style={styles.container}>

                <View style={styles.container}>
                          {
                          this.state.image ? (
                          <Image style={styles.image} source={{uri: image }}/>) :
                            <View style={styles.titleContainer}> 

                          { 
                            this.state.fontLoaded ? ( <Text style={styles.title}> Smart Receipt </Text> ) : null 
                          }
                            <Ionicons name={"md-bulb"} style={styles.BulbIcon}/> 
                </View>
                          } 
            </View>

                 {  
                  (this.state.indicator ) ? 
                    (<ActivityIndicator
                      animating={true}
                      style={styles.indicator}
                      size="large"
                    />) : null 
                 }
                  
                 {  
                  (this.state.response) ? 
                    (<View style={styles.container}>
                        <Text style={styles.text} key={this.state.response} > {response} </Text>
                      </View>) : null 
                 }

                <View style={styles.textInput}>

                    <TextInput
                      placeholder="Looking for..."
                      style={styles.input}
                      onChangeText={(text) => this.setState({text})}
                      value={this.state.text}
                    /> 

                 </View>



                    <View style={styles.bContainer}>
                        { 
                          (this.state.image && !this.state.response) ?  null : (  
                          <TouchableOpacity
                              onPress={this.pickCamera}
                              style={styles.button}
                          >  
                              {
                                this.state.fontLoaded ? ( <Text style={[styles.countText]}> Take a proto </Text> ) : null
                              }

                          </TouchableOpacity>
                          ) 
                        }
                           
                        { 
                          (this.state.image && !this.state.response) ? null : (
                          <TouchableOpacity
                              onPress={this.pickImage}
                              style={styles.button}     
                          >
                              {
                                this.state.fontLoaded ? ( <Text style={[styles.countText]}> Choose Receipt </Text> ) : null
                              }

                            </TouchableOpacity> 
                          ) 
                        }
                          
                        { 
                          this.state.image ? (
                          <TouchableOpacity
                              onPress={this.sendIt}
                              style={styles.button}         
                          >
                              {
                                this.state.fontLoaded ? ( <Text style={[styles.countText]}> Send Receipt </Text> ) : null
                              } 

                            </TouchableOpacity> 
                          ) : null
                        }

                    </View>
                  

                </View>
            </ScrollView>
          
        </View> 
        </KeyboardAvoidingView> 
      );
    }
  }

AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  indicator: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
  },
  main: {
      flex: 1,
      backgroundColor: '#1f66c3',
      justifyContent:'space-between',
      flexDirection:'row',
      flexWrap:'wrap',

  },
    container: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',

  },
    titleContainer: {
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      marginTop:165,
      marginBottom:165,
    
  },
    bContainer: {
      flex:1,
      maxHeight:180,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:20,
      paddingHorizontal:10,
      marginBottom:25,
   
  },
    button: {
      flex:1,
      padding:10,
      alignItems:'center',
      margin:5,
      maxHeight:50,
      width:260,
      borderRadius:5,
      backgroundColor:'#2880ec',
      
  },
    input: {
      flex:1,
      textAlign: 'center',
      borderColor:'white',
      borderWidth:2,
      width:360, 
      height:55,  
      borderRadius:5,
      fontSize:32,

  },
    textInput: {
      flex:1,
      alignItems: 'center',
      margin:7.5,
      borderRadius:5,
      backgroundColor:'#edf4eb',
      borderWidth:2,
      
  },
    text: {
      flex:1,
      alignItems:'center',
      borderRadius: 5,
      fontSize:35,
      color:'white',
      margin:65,

  },
    countText: {
      flex:1,
      fontSize:25,
      fontWeight:'bold',
      fontFamily:'menu',
      color:'white',

  },
    BulbIcon: {
      position: 'absolute',
      left:250,
      flex:1,
      flexWrap:'wrap',
      flexDirection:'row',
      alignItems:'flex-start',
      marginTop:40,
      maxWidth:32,
      fontSize:32,
      transform: [{ rotate: '35deg'}],
      color:'#f2be1a',

  },
    title : {
      flex:1,
      flexDirection:'row',
      flexWrap:'wrap',
      alignItems:'flex-start',
      marginTop:30,
      maxWidth:275,
      fontSize:35,
      fontFamily:'title',
      color:'white',
    
  },
   image : {
      flex:1,
      marginTop:30,
      width:335,
      height:475,

  }
});
