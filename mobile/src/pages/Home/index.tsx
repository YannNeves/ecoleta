import React, { ChangeEvent, useEffect, useState } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
  nome: string;
  sigla: string;
}

interface IBGECityResponse{
  nome: string;
}

interface pickerType{
  label: string;
  value: any;
}

const Home = () => {
  const [ufs, setUfs] = useState<pickerType[]>([]);
  const [cities, setCities] = useState<pickerType[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('http://servicodados.ibge.gov.br/api/v1/localidades/estados').then( response => {
      const ufInitials = response.data.map(uf => {
        return {
          label: uf.nome,
          value: uf.sigla
        } 
      });
      
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUF === '0'){
      return;
    }

    axios
      .get<IBGECityResponse[]>(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          } 
        });

        setCities(cityNames);
      });
  }, [selectedUF]);
  
  function handleSelectUF(value: string){
    const uf = value;
    setSelectedUF(uf);
  }

  function handleSelectCity(value: string){
    const city = value;
    setSelectedCity(city);
  }

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      selectedUF,
      selectedCity
    });
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior='padding'
    >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <View>
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
            
          <RNPickerSelect
              placeholder={{
                label: 'Selecione o estado...',
                value: null,
                color: 'green',
              }}
              items={ufs}
              onValueChange={(value) => handleSelectUF(value)}
              style={styles}
              doneText="Fechar"
          />

          <RNPickerSelect
              placeholder={{
                label: 'Selecione a cidade...',
                value: null,
                color: 'green',
              }}
              items={cities}
              onValueChange={(value) => handleSelectCity(value)}
              style={styles}
              doneText="Fechar"
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;