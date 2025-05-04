import { router } from 'expo-router';
import { debounce } from 'lodash';
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import api from './api/axiosInstance';
type FormField = keyof typeof initialFormState;

const initialFormState = {
  nomeMae: '',
  cepMae: '',
  telefoneMae: '',
  trabalhoMae: '',
  nascimentoMae: '',
  cpfMae: '',
  emailMae: '',
  telefoneTrabalhoMae: '',
  enderecoMae: '',
  rgMae: '',
  profissaoMae: ''
};

const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
const telefoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
const rgMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/];
const dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

export default function FamiliaresMaternoScreen() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<FormField, string>>({} as Record<FormField, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateField = useCallback(debounce((field: FormField, value: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };

      if (value.trim().length > 0) {
        delete newErrors[field];
      }

      switch(field) {
        case 'cpfMae':
          if (value.replace(/\D/g, '').length !== 11) {
            newErrors[field] = 'CPF inválido';
          }
          break;

        case 'nascimentoMae':
          if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
            newErrors[field] = 'Data inválida';
          }
          break;

        case 'rgMae':
          if (value.replace(/\D/g, '').length !== 9) {
            newErrors[field] = 'RG inválido';
          }
          break;

        case 'emailMae':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field] = 'E-mail inválido';
          }
          break;

        default:
          if (!value.trim() && field !== 'trabalhoMae' && field !== 'enderecoMae') {
            newErrors[field] = 'Campo obrigatório';
          }
      }

      return newErrors;
    });
  }, 300), []);

  const handleChange = useCallback((field: FormField, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    validateField.flush(); // Garante que todas as validações pendentes sejam executadas

    if (Object.keys(errors).length === 0) {
      try {
        // Enviar os dados do formulário para o backend
        const response = await api.post('/maes', formData);
        console.log('Dados enviados com sucesso:', response.data);

        // Redirecionar para a próxima tela
        alert('Dados do responsável materno cadastrados com sucesso!');
        router.push('/forms-paterno');
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao enviar os dados. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Por favor, corrija os erros antes de enviar.');
      setIsSubmitting(false);
    }
  }, [errors, formData, validateField]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.select({ ios: hp(4), android: hp(1) })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dados do Responsável Materno</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Nome completo"
            placeholderTextColor="#666"
            value={formData.nomeMae}
            onChangeText={(v) => handleChange('nomeMae', v)}
          />

          <View style={styles.row}>
          <MaskInput
              style={styles.halfWidthInput}
              placeholder="CEP"
              placeholderTextColor="#666"
              value={formData.cepMae}
              onChangeText={(v) => handleChange('cepMae', v)} // Adicione esta linha!
              mask={cepMask}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Telefone"
              placeholderTextColor="#666"
              value={formData.telefoneMae}
              onChangeText={(v) => handleChange('telefoneMae', v)}
              mask={telefoneMask}
              keyboardType="phone-pad"
            />
          </View>

          <TextInput
            style={styles.fullWidthInput}
            placeholder="Local de trabalho"
            placeholderTextColor="#666"
            value={formData.trabalhoMae}
            onChangeText={(v) => handleChange('trabalhoMae', v)}
          />

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Data de nascimento"
              placeholderTextColor="#666"
              value={formData.nascimentoMae}
              onChangeText={(v) => handleChange('nascimentoMae', v)}
              mask={dataMask}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="CPF"
              placeholderTextColor="#666"
              value={formData.cpfMae}
              onChangeText={(v) => handleChange('cpfMae', v)}
              mask={cpfMask}
              keyboardType="number-pad"
            />
          </View>

          <TextInput
            style={styles.fullWidthInput}
            placeholder="E-mail"
            placeholderTextColor="#666"
            value={formData.emailMae}
            onChangeText={(v) => handleChange('emailMae', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Telefone do trabalho"
              placeholderTextColor="#666"
              value={formData.telefoneTrabalhoMae}
              onChangeText={(v) => handleChange('telefoneTrabalhoMae', v)}
              mask={telefoneMask}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.halfWidthInput}
              placeholder="Endereço completo"
              placeholderTextColor="#666"
              value={formData.enderecoMae}
              onChangeText={(v) => handleChange('enderecoMae', v)}
            />
          </View>

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="RG"
              placeholderTextColor="#666"
              value={formData.rgMae}
              onChangeText={(v) => handleChange('rgMae', v)}
              mask={rgMask}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.halfWidthInput}
              placeholder="Profissão"
              placeholderTextColor="#666"
              value={formData.profissaoMae}
              onChangeText={(v) => handleChange('profissaoMae', v)}
            />
          </View>

          {Object.entries(errors).map(([field, message]) => (
            <Text key={field} style={styles.errorText}>
              {message}
            </Text>
          ))}

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Validando...' : 'Próximo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backLink}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  header: {
    backgroundColor: '#902121',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  headerTitle: {
    color: 'white',
    fontSize: hp(2.1),
    fontWeight: '600',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: wp(2),
    padding: wp(3),
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(1.5),
    marginBottom: hp(0.8),
  },
  fullWidthInput: {
    width: '100%',
    height: hp(5.3),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: '#fff',
    fontSize: hp(1.7),
    color: '#333',
    marginBottom: hp(0.8),
  },
  halfWidthInput: {
    width: '48.5%',
    height: hp(5.3),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: '#fff',
    fontSize: hp(1.7),
    color: '#333',
  },
  button: {
    backgroundColor: '#8B0000',
    borderRadius: wp(1.5),
    paddingVertical: hp(1.3),
    marginTop: hp(1.5),
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: '600',
  },
  backButton: {
    marginTop: hp(1.2),
    alignSelf: 'center',
  },
  backLink: {
    color: '#902121',
    fontSize: hp(1.6),
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#dc2626',
    fontSize: hp(1.4),
    marginBottom: hp(0.5),
    paddingHorizontal: wp(1),
  },
});