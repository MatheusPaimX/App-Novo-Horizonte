import { Link, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

type FormField = 'reside' | 'respNome' | 'respTelefone' | 'pessoasAutorizadas';

const initialFormState = {
  reside: '',
  respNome: '',
  respTelefone: '',
  pessoasAutorizadas: '',
};

const FinalScreen = () => {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = useCallback((field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const telefoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  const handleSubmit = async () => {
    try {
      const response = await api.post('/info', formData);
      console.log('Dados enviados com sucesso:', response.data);

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
          value={formData.reside}
          onChangeText={(v) => handleChange('reside', v)}
        />
      </View>

      {/* Responsável Financeiro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsável Financeiro</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Responsável"
            value={formData.respNome}
            onChangeText={(v) => handleChange('respNome', v)}
          />
          <MaskInput
            style={styles.input}
            placeholder="Telefone"
            value={formData.respTelefone}
            onChangeText={(v) => handleChange('respTelefone', v)}
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
          value={formData.pessoasAutorizadas}
          onChangeText={(v) => handleChange('pessoasAutorizadas', v)}
          multiline
        />
      </View>

      {/* Aviso Documentos */}
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>
          OBS: Só clique no botão &quot;Envio de Documentos&quot; se você for enviar os documentos por e-mail.
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
        onPress={handleSubmit}
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