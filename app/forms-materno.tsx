import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import MaskInput from 'react-native-mask-input';
import { debounce } from 'lodash';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

type FormField = keyof typeof initialFormState;

const initialFormState = {
  nomeMaterno: '',
  cepMaterno: '',
  telefoneMaterno: '',
  trabalhoMaterno: '',
  nascimentoMaterno: '',
  cpfMaterno: '',
  emailMaterno: '',
  telefoneTrabalhoMaterno: '',
  enderecoMaterno: '',
  rgMaterno: '',
  profissaoMaterno: ''
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

  const validateField = useCallback(debounce((field: FormField, value: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };

      if (value.trim().length > 0) {
        delete newErrors[field];
      }

      switch(field) {
        case 'cpfMaterno':
          if (value.replace(/\D/g, '').length !== 11) {
            newErrors[field] = 'CPF inválido';
          }
          break;

        case 'nascimentoMaterno':
          if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
            newErrors[field] = 'Data inválida';
          }
          break;

        case 'rgMaterno':
          if (value.replace(/\D/g, '').length !== 9) {
            newErrors[field] = 'RG inválido';
          }
          break;

        case 'emailMaterno':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field] = 'E-mail inválido';
          }
          break;

        default:
          if (!value.trim() && field !== 'trabalhoMaterno' && field !== 'enderecoMaterno') {
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

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    validateField.flush();

    setTimeout(() => {
      if (Object.keys(errors).length === 0) {
        router.push('/forms-paterno');
      }
      setIsSubmitting(false);
    }, 100);
  }, [errors]);

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
            value={formData.nomeMaterno}
            onChangeText={(v) => handleChange('nomeMaterno', v)}
          />

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="CEP"
              placeholderTextColor="#666"
              value={formData.cepMaterno}
              onChangeText={(v) => handleChange('cepMaterno', v)}
              mask={cepMask}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Telefone"
              placeholderTextColor="#666"
              value={formData.telefoneMaterno}
              onChangeText={(v) => handleChange('telefoneMaterno', v)}
              mask={telefoneMask}
              keyboardType="phone-pad"
            />
          </View>

          <TextInput
            style={styles.fullWidthInput}
            placeholder="Local de trabalho"
            placeholderTextColor="#666"
            value={formData.trabalhoMaterno}
            onChangeText={(v) => handleChange('trabalhoMaterno', v)}
          />

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Data de nascimento"
              placeholderTextColor="#666"
              value={formData.nascimentoMaterno}
              onChangeText={(v) => handleChange('nascimentoMaterno', v)}
              mask={dataMask}
              keyboardType="number-pad"
            />
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="CPF"
              placeholderTextColor="#666"
              value={formData.cpfMaterno}
              onChangeText={(v) => handleChange('cpfMaterno', v)}
              mask={cpfMask}
              keyboardType="number-pad"
            />
          </View>

          <TextInput
            style={styles.fullWidthInput}
            placeholder="E-mail"
            placeholderTextColor="#666"
            value={formData.emailMaterno}
            onChangeText={(v) => handleChange('emailMaterno', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="Telefone do trabalho"
              placeholderTextColor="#666"
              value={formData.telefoneTrabalhoMaterno}
              onChangeText={(v) => handleChange('telefoneTrabalhoMaterno', v)}
              mask={telefoneMask}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.halfWidthInput}
              placeholder="Endereço completo"
              placeholderTextColor="#666"
              value={formData.enderecoMaterno}
              onChangeText={(v) => handleChange('enderecoMaterno', v)}
            />
          </View>

          <View style={styles.row}>
            <MaskInput
              style={styles.halfWidthInput}
              placeholder="RG"
              placeholderTextColor="#666"
              value={formData.rgMaterno}
              onChangeText={(v) => handleChange('rgMaterno', v)}
              mask={rgMask}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.halfWidthInput}
              placeholder="Profissão"
              placeholderTextColor="#666"
              value={formData.profissaoMaterno}
              onChangeText={(v) => handleChange('profissaoMaterno', v)}
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