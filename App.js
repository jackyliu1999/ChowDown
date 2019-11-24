import React, {Component} from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      checkbox1: false,
      checkbox2:false,
      checkboxNear:false,
      checkboxRecipes:false,
      checkboxNear2:false,
      checkboxRecipes2:false,
      image:null,
      placeResults: [],
      recipeResults: []
    };
  }
  render() {

    let gallery = null; //pick image from gallery
    if (this.state.checkbox1 === true)
    {
      gallery = (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
            icon={
              <Icon
                name="image"
                size={15}
                color="white"
              />
            }
              title="  Pick an image from Gallery"
              onPress={this._pickImage}
            />
            {this.state.image != null &&
              <View>
                <Image source={{ uri: this.state.image.uri }} style={{ top: 10, marginBottom: 10, width: 300, height: 300 }} />
                <Button containerStyle={{marginTop: 3}}//https://react-native-elements.github.io/react-native-elements/docs/button.html
              icon={
                <Icon
                  name="car"
                  size={15}
                  color="white"
                />
              }
                title="Locations"
                color="white"
                onPress={() => this.place()}
              />
              <Button containerStyle={{marginTop: 3}}
                icon={
                  <Icon
                    name="book"
                    size={15}
                    color="white"
                  />
                }
                title="  Recipes"
                onPress={() => this.recipe()}
              />
              <Text>{this.state.result}</Text>
              </View>
              
              
            }
              
          </View>
        
      );
    }

    let keyword = null;
    if (this.state.checkbox2 == true)
    {
      keyword = (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CheckBox
          title='Find Locations near me'
          checked={this.state.checkboxNear2}
          onPress={() => this.setState({checkboxNear2: !this.state.checkboxNear2})}
        />
        <CheckBox
          title='Find Recipes'
          checked={this.state.checkboxRecipes2}
          onPress={() => this.setState({checkboxRecipes2: !this.state.checkboxRecipes2})}
        />
        </View>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1}}>
        <ScrollView style={styles.container}>
          <Text style={{color: 'red',textAlignVertical:'top',textAlign:'center',fontWeight: 'bold',fontSize: 20}}>ChowDown!</Text>

          <CheckBox
            title='Search Food by Image'
            checked={this.state.checkbox1}
            onPress={() => this.setState({checkbox1: !this.state.checkbox1, checkbox2: false, image: null, placeResults: [], recipeResults: []})}
          />
          <CheckBox
            title='Search Food by Name'
            checked={this.state.checkbox2}
            onPress={() => this.setState({checkbox2: !this.state.checkbox2, checkbox1: false, image: null, placeResults: [], recipeResults: []})}
          />
          {gallery}
          {keyword}
          {
            (this.state.placeResults.map((place, key) => {
              return (
                <View key={key}>
                  <Text style={{fontSize: 22}}>{place.name}</Text>
                  <Text style={{fontSize: 16}}>{place.address}</Text>
                  <Text style={{fontSize: 16}}>Cost: {place.price}</Text>
                  <View style={{height: 1, backgroundColor: "black"}}></View>
                </View>
              )
            }))
          }
          {
            (this.state.recipeResults.map((recipe, key) => {
              return (
                <View key={key}>
                  <Text>{recipe[1]}</Text>
                  <Image source={{ uri: recipe[2] }} style={{ width: 100, height: 100 }} />
                  <Text>{recipe[3]}</Text>
                </View>
              )
            }))
          }
        </ScrollView>
      </SafeAreaView>
      
    );
  }

  place() {
    let formData = new FormData();
    formData.append('image', {
      uri: this.state.image.uri,
      type: "image/jpg",
      name: "image"
    });
    axios.post(BASE_URL+'/image-analyze/place', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
        this.setState({placeResults: response.data, recipeResults: []})
    }).catch(function(error){
      if(error !== null) {
        console.log(error);
      }

    })
  }

  recipe() {
    let formData = new FormData();
    formData.append('image', {
      uri: this.state.image.uri,
      type: "image/jpg",
      name: "image"
    });
    axios.post(BASE_URL+'/image-analyze/recipe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
        this.setState({recipeResults: response.data, placeResults: []})
    }).catch(function(error){
      if(error !== null) {
        console.log(error);
      }

    })
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });


    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };






}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
},


});
