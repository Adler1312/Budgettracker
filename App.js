import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import CustomModal from './CustomModal';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  text: {
    fontSize: 20,
    color: '#333', 
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#4CAF50', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: '90%', 
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd', 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: '#333',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
  },
  expenseItem: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  switchButton: {
    marginTop: 5,
  },
  gain: {
    color: 'green',
    fontSize: 16,
    marginTop: 5,
  },
  loss: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },});

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        balance: 0,
        tempBalance: '',
        modalVisible: false,
        expense: '',
        expenseDescription: '',
        expensesList: [],
        isModalVisible: false,
      };
  }
 toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  submitNewBalance = () => {
    const { tempBalance } = this.state;
    const parsedBalance = parseFloat(tempBalance);
    if (!isNaN(parsedBalance) && parsedBalance >= 0) {
      this.setState({ balance: parsedBalance, modalVisible: false });
      AsyncStorage.setItem('userBalance', parsedBalance.toString());
    } else {
      alert('Ungültiger Betrag!');
    }
  };

  updateExpenseAmount = (amount) => {
    this.setState({ expense: parseFloat(amount) || 0 });
  };

  updateExpenseDescription = (description) => {
    this.setState({ expenseDescription: description });
  };

  addExpense = () => {
    const { expense, expenseDescription, balance } = this.state;

    if (expense > 0 && balance - expense >= 0 && expenseDescription) {
      this.setState((prevState) => ({
        balance: prevState.balance - expense,
        expensesList: [...prevState.expensesList, { expense, description: expenseDescription }],
        expense: '',
        expenseDescription: '',
      }));
    } else {
      alert('Unglültiger Betrag!');
    }
  };

  fetchBalance = async () => {
    const userBalance = await AsyncStorage.getItem('userBalance');

    if (isNaN(parseFloat(userBalance))) {
      await this.promptUserBalance();
    }

    this.setState({
      balance: parseFloat(userBalance) || 0,
    });
  };

  componentDidMount() {
    this.fetchBalance();
  }

  removeExpense = (index) => {
    this.setState((prevState) => ({
      expensesList: prevState.expensesList.filter((_, i) => i !== index)
    }));
  };

 
  showExpenseChart = () => {
    this.props.navigation.navigate('ExpenseChart', { expensesList: this.state.expensesList });
  };

  render() {
    const { balance, modalVisible, tempBalance, expense, expenseDescription, expensesList, isModalVisible } = this.state;

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Budgettracker</Text>
        <Text style={styles.balanceText}>Saldo: ${balance}</Text>
  
        <TouchableOpacity style={styles.button} onPress={() => this.setModalVisible(true)}>
          <Text style={styles.buttonText}>Kontostand ändern</Text>
        </TouchableOpacity>
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter new balance"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({ tempBalance: text })}
                value={tempBalance}
              />
              <TouchableOpacity style={styles.button} onPress={this.submitNewBalance}>
                <Text style={styles.buttonText}>Bestätigen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
  
        <TextInput
          placeholder="Betrag"
          onChangeText={(text) => this.setState({ expense: parseFloat(text) || 0 })}
          value={expense.toString()}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Beschreibung"
          onChangeText={(text) => this.setState({ expenseDescription: text })}
          value={expenseDescription}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={this.addExpense}>
          <Text style={styles.buttonText}>Ausgabe hinzufügen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.toggleModal}>
          <Text style={styles.buttonText}>Ausgaben anzeigen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.showExpenseChart}>
        <Text style={styles.buttonText}>Ausgaben als Grafik anzeigen</Text>
      </TouchableOpacity>
  
        <CustomModal
          isVisible={isModalVisible}
          toggleModal={this.toggleModal}
          removeExpense={this.removeExpense}
        >
          <Text style={styles.gain}>+ ${balance}</Text>
          {expensesList.map((item, index) => (
          <View key={index} style={styles.expenseItem}>
          <Text style={styles.loss}>- ${item.expense} für {item.description}</Text>
         
          </View>
          ))}
        </CustomModal>
      </ScrollView>
    </KeyboardAvoidingView>

 

     );
  }
}
class ExpenseChartScreen extends React.Component {
  render() {
    const { expensesList } = this.props.navigation.state.params;
    const data = {
      labels: expensesList.map(expense => expense.description), 
      datasets: [{
        data: expensesList.map(expense => expense.expense)
      }]
    };
    return (
      <View style={styles.container}>
        <LineChart
          data={data}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  }
}


const AuthScreen = ({ navigation }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      navigation.navigate('Home');
    } else {
      Alert.alert('Anmeldung fehlgeschlagen', 'Falscher Benutzername oder Passwort');
    }
  };

  const register = async () => {
    const storedUsername = await AsyncStorage.getItem('username');

    if (username === storedUsername) {
      Alert.alert('Registrierung fehlgeschlagen', 'Benutzername bereits vergeben');
    } else if (username && password) {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      navigation.navigate('Home');
    } else {
      Alert.alert('Registrierung fehlgeschlagen', 'Bitte geben Sie Benutzername und Passwort ein');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isRegistering ? 'Registrieren' : 'Login'}</Text>
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      {isRegistering ? (
        <Button title="Register" onPress={register} style={styles.button} />
      ) : (
        <Button title="Anmelden" onPress={signIn} style={styles.button} />
      )}
      <Button
        title={isRegistering ? "Bereits einen Account?" : "Noch kein Account?"}
        onPress={() => setIsRegistering(!isRegistering)}
        style={styles.switchButton}
      />
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    ExpenseChart: {  
      screen: ExpenseChartScreen,
    },
  },
  {
    initialRouteName: 'Auth',
  }
);


export default createAppContainer(AppNavigator);