import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import api from './api/axiosInstance';

const FinalScreen = () => {
  // Estados
  const [resideCom, setResideCom] = useState('');
  const [responsavelFinanceiro, setResponsavelFinanceiro] = useState('');
  const [telefoneFinanceiro, setTelefoneFinanceiro] = useState('');
  const [pessoasAutorizadas, setPessoasAutorizadas] = useState('');

  // Máscaras
  const telefoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  const handleSubmit = async () => {
    const formData = {
      resideCom,
      responsavelFinanceiro,
      telefoneFinanceiro,
      pessoasAutorizadas,
    };

    try {
      // Enviar os dados para o backend
      const response = await api.post('/alunos', formData);
      console.log('Dados enviados com sucesso:', response.data);

      // Redirecionar após o envio bem-sucedido
      alert('Cadastro realizado com sucesso!');
      router.push('/home');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Seção Reside Com */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reside Com</Text>
        <TextInput
          style={styles.inputFull}
          placeholder="Ex: Pai, Mãe, Avós..."
          value={resideCom}
          onChangeText={setResideCom}
        />
      </View>

      {/* Responsável Financeiro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsável Financeiro</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Responsável"
            value={responsavelFinanceiro}
            onChangeText={setResponsavelFinanceiro}
          />
          <MaskInput
            style={styles.input}
            placeholder="Telefone"
            value={telefoneFinanceiro}
            onChangeText={setTelefoneFinanceiro}
            mask={telefoneMask}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Pessoas Autorizadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pessoas Autorizadas a Buscar</Text>
        <TextInput
          style={styles.inputFull}
          placeholder="Nomes completos separados por vírgula"
          value={pessoasAutorizadas}
          onChangeText={setPessoasAutorizadas}
          multiline
        />
      </View>

      {/* Aviso Documentos */}
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>
          OBS: Só clique no botão "Envio de Documentos" se você for enviar os documentos por e-mail.
          Se for entregar pessoalmente ou já entregou, não precisa clicar!
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Enviar Documentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Baixar Termos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Exportar CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Exportar PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Cadastrar */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit} // Chama a função de envio
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Botão Anterior */}
      <Link href="/forms-obs" style={styles.backLink}>
        Anterior
      </Link>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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
  inputFull: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
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
  alertBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  alertText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flexBasis: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#902121',
  },
  button: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    color: '#902121',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
});

export default FinalScreen;