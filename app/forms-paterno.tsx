import { Link, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import api from './api/axiosInstance';

type FormField = keyof typeof initialFormState;

const initialFormState = {
  nomePai: '',
  cepPai: '',
  telefonePai: '',
  trabalhoPai: '',
  nascimentoPai: '',
  cpfPai: '',
  emailPai: '',
  telefoneTrabalhoPai: '',
  enderecoPai: '',
  rgPai: '',
  profissaoPai: ''
};

const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
const telefoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
const rgMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];
const dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

export default function FamiliaresPaternoScreen() {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = useCallback((field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/paterno', formData);
      console.log('Dados enviados com sucesso:', response.data);
      router.push('/forms-obs');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dados dos Familiares</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Responsável Paterno</Text>

          <View style={styles.form}>
            {/* Nome */}
            <TextInput
              style={styles.inputFull}
              placeholder="Nome do Responsável Paterno"
              value={formData.nomePai}
              onChangeText={(v) => handleChange('nomePai', v)}
            />

            {/* CEP e Telefone */}
            <View style={styles.row}>
              <MaskInput
                style={styles.input}
                placeholder="CEP"
                value={formData.cepPai}
                onChangeText={(v) => handleChange('cepPai', v)}
                mask={cepMask}
                keyboardType="numeric"
              />
              <MaskInput
                style={styles.input}
                placeholder="Telefone"
                value={formData.telefonePai}
                onChangeText={(v) => handleChange('telefonePai', v)}
                mask={telefoneMask}
                keyboardType="phone-pad"
              />
            </View>

            {/* Local Trabalho */}
            <TextInput
              style={styles.inputFull}
              placeholder="Local de Trabalho"
              value={formData.trabalhoPai}
              onChangeText={(v) => handleChange('trabalhoPai', v)}
            />

            {/* Nascimento e CPF */}
            <View style={styles.row}>
              <MaskInput
                style={styles.input}
                placeholder="Data de Nascimento"
                value={formData.nascimentoPai}
                onChangeText={(v) => handleChange('nascimentoPai', v)}
                mask={dataMask}
                keyboardType="numeric"
              />
              <MaskInput
                style={styles.input}
                placeholder="CPF"
                value={formData.cpfPai}
                onChangeText={(v) => handleChange('cpfPai', v)}
                mask={cpfMask}
                keyboardType="numeric"
              />
            </View>

            {/* Email */}
            <TextInput
              style={styles.inputFull}
              placeholder="Email"
              value={formData.emailPai}
              onChangeText={(v) => handleChange('emailPai', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Telefone Trabalho e Endereço */}
            <View style={styles.row}>
              <MaskInput
                style={styles.input}
                placeholder="Telefone do Trabalho"
                value={formData.telefoneTrabalhoPai}
                onChangeText={(v) => handleChange('telefoneTrabalhoPai', v)}
                mask={telefoneMask}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                value={formData.enderecoPai}
                onChangeText={(v) => handleChange('enderecoPai', v)}
              />
            </View>

            {/* RG e Profissão */}
            <View style={styles.row}>
              <MaskInput
                style={styles.input}
                placeholder="RG"
                value={formData.rgPai}
                onChangeText={(v) => handleChange('rgPai', v)}
                mask={rgMask}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Profissão"
                value={formData.profissaoPai}
                onChangeText={(v) => handleChange('profissaoPai', v)}
              />
            </View>
          </View>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>

        <Link href="/forms-materno" style={styles.backLink}>
          Voltar
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos IDÊNTICOS à tela materna
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#902121',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    color: '#902121',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  form: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputFull: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    color: '#902121',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});