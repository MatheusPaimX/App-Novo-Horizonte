import { Picker } from '@react-native-picker/picker';
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
import api from './api/axiosInstance';

type FormField = keyof typeof initialFormState;

const initialFormState = {
  matriculaTipo:'',
   escola:'',
  temIrmaos:'',
  irmaosNome:'',
  temEspecialista:'',
  especialista: '',
  temAlergias: '',
  alergia:'',
  temMedicamento:'',
  medicamento:'',
};

export default function ObservacoesScreen() {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = useCallback((field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/observacoes', formData);
      console.log('Dados enviados com sucesso:', response.data);

      alert('Dados de observações cadastrados com sucesso!');
      router.push('/forms-info');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao enviar os dados. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observações</Text>

        {/* Matrícula */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Matrícula</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.matriculaTipo}
              onValueChange={(v) => handleChange('matriculaTipo', v)}
              dropdownIconColor="#666">
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Inicial" value="inicial" />
              <Picker.Item label="Transferência Municipal/Estadual" value="transferencia_municipal_estadual" />
              <Picker.Item label="Transferência Particular" value="transferencia_particular" />
            </Picker>
          </View>
          {(formData.escola === 'transferencia_municipal_estadual' || formData.escola === 'transferencia_particular') && (
            <TextInput
              style={styles.input}
              placeholder="Qual Escola"
              value={formData.escola}
              onChangeText={(v) => handleChange('escola', v)}
            />
          )}
        </View>

        {/* Irmão(s) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Irmão(s)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.temIrmaos}
              onValueChange={(v) => handleChange('temIrmaos', v)}
              dropdownIconColor="#666">
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>
          {formData.irmaosNome === 'sim' && (
            <TextInput
              style={styles.input}
              placeholder="Qual(s) Irmão(s)?"
              value={formData.irmaosNome}
              onChangeText={(v) => handleChange('irmaosNome', v)}
            />
          )}
        </View>

        {/* Especialista */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Especialista</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.temEspecialista}
              onValueChange={(v) => handleChange('temEspecialista', v)}
              dropdownIconColor="#666">
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>
          {formData.temEspecialista === 'sim' && (
            <TextInput
              style={styles.input}
              placeholder="Ex: Neurologista, Fonoaudiólogo"
              value={formData.especialista}
              onChangeText={(v) => handleChange('especialista', v)}
            />
          )}
        </View>

        {/* Alergias */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alergias</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.temAlergias}
              onValueChange={(v) => handleChange('temAlergias', v)}
              dropdownIconColor="#666">
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>
          {formData.alergia === 'sim' && (
            <TextInput
              style={styles.input}
              placeholder="Ex: Alimentação, Remédios..."
              value={formData.alergia}
              onChangeText={(v) => handleChange('alergia', v)}
            />
          )}
        </View>

        {/* Medicamento em Uso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medicamento em Uso</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.temMedicamento}
              onValueChange={(v) => handleChange('temMedicamento', v)}
              dropdownIconColor="#666">
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>
          {formData.medicamento === 'sim' && (
            <TextInput
              style={styles.input}
              placeholder="Qual medicamento?"
              value={formData.medicamento}
              onChangeText={(v) => handleChange('medicamento', v)}
            />
          )}
        </View>
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>

      <Link href="/forms-paterno" style={styles.backLink}>
        Voltar
      </Link>
    </ScrollView>
  );
}

// Estilos idênticos aos formulários anteriores
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10,
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