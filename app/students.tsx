import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import axios from 'axios';

// 1. Configuração da API (ALTERE ESTE VALOR)
const API_URL = 'http://SEU_IP:8080/api/alunos';

// 2. Interceptor global para tratamento de erros
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na API:', error.response?.data);
    if (error.response?.status === 401) {
      const router = useRouter();
      router.replace('/');
    }
    return Promise.reject(error);
  }
);

interface Student {
  id: string;
  nome: string;
  cpf: string;
  pai: string;
  mae: string;
  endereco: string;
  telefone: string;
  telefoneResponsavel: string;
  observacoes: string;
  dataCadastro: string;
}

export default function StudentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // 3. Função de carregamento dos dados com Axios
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Student[]>(API_URL);
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados dos alunos');
      console.error('Erro na requisição:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Efeito com dependência do refreshTrigger
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // 5. Função aprimorada para fechar modal + atualizar dados
  const handleCloseModal = () => {
    setSelectedStudent(null);
    setRefreshTrigger(prev => !prev);
  };

  // 6. Filtragem mantida igual
  const filteredStudents = students.filter(student =>
    [student.nome, student.cpf, student.pai, student.mae]
      .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 7. Renderização do modal (alterado onRequestClose)
  const renderDetailModal = () => (
    <Modal
      visible={!!selectedStudent}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <ScrollView style={styles.modalContainer}>
        {selectedStudent && (
          <>
            <Text style={styles.modalTitle}>Detalhes do Aluno</Text>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Nome:</Text>
              <Text style={styles.detailValue}>{selectedStudent.nome}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>CPF:</Text>
              <Text style={styles.detailValue}>{selectedStudent.cpf}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pai:</Text>
              <Text style={styles.detailValue}>{selectedStudent.pai}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mãe:</Text>
              <Text style={styles.detailValue}>{selectedStudent.mae}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Endereço:</Text>
              <Text style={styles.detailValue}>{selectedStudent.endereco}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Telefone:</Text>
              <Text style={styles.detailValue}>{selectedStudent.telefone}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Contato Responsável:</Text>
              <Text style={styles.detailValue}>{selectedStudent.telefoneResponsavel}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Data de Cadastro:</Text>
              <Text style={styles.detailValue}>{selectedStudent.dataCadastro}</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#902121" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Listagem de Alunos</Text>
          <Text style={styles.sectionTitle}>Busca Avançada</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por CPF, nome, pai ou mãe..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredStudents.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentCard}
            onPress={() => setSelectedStudent(student)}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.nome}</Text>
              <Text style={styles.studentSubtext}>CPF: {student.cpf}</Text>
              <Text style={styles.studentSubtext}>Data de Cadastro: {student.dataCadastro}</Text>
            </View>
            <Text style={styles.detailsText}>▶</Text>
          </TouchableOpacity>
        ))}

        <Link href="/home" style={styles.backLink}>
          Voltar para Login
        </Link>
      </ScrollView>

      {renderDetailModal()}
    </KeyboardAvoidingView>
  );
}

// 8. Estilos mantidos EXATAMENTE IGUAIS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: wp(4),
    paddingBottom: hp(4),
  },
  header: {
    backgroundColor: '#902121',
    paddingVertical: hp(2),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  headerTitle: {
    color: 'white',
    fontSize: hp(2.5),
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: hp(2),
    textAlign: 'center',
    marginTop: hp(1),
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: wp(1.5),
    padding: wp(3),
    marginBottom: hp(2),
    fontSize: hp(1.8),
    elevation: 2,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: wp(2),
    padding: wp(3),
    elevation: 2,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: hp(1.5),
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: hp(1.9),
    color: '#333',
    fontWeight: '600',
  },
  studentCpf: {
    fontSize: hp(1.6),
    color: '#666',
    marginTop: hp(0.5),
  },
  detailsButton: {
    paddingHorizontal: wp(3),
  },
  detailsText: {
    color: '#902121',
    fontSize: hp(1.7),
    fontWeight: '600',
  },
  backLink: {
    color: '#902121',
    fontSize: hp(1.8),
    textAlign: 'center',
    marginTop: hp(3),
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(5),
  },
  modalTitle: {
    fontSize: hp(2.8),
    color: '#902121',
    fontWeight: 'bold',
    marginBottom: hp(3),
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
    padding: hp(1),
    backgroundColor: '#fff',
    borderRadius: wp(1),
    elevation: 1,
  },
  detailLabel: {
    fontSize: hp(1.8),
    color: '#666',
    fontWeight: '600',
    width: wp(40),
  },
  detailValue: {
    fontSize: hp(1.8),
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: '#902121',
    padding: hp(2),
    borderRadius: wp(1),
    marginTop: hp(3),
  },
  closeButtonText: {
    color: 'white',
    fontSize: hp(2),
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(5),
  },
  errorText: {
    color: '#ff4444',
    fontSize: hp(2),
    textAlign: 'center',
  },
  studentSubtext: {
    fontSize: hp(1.6),
    color: '#666',
    marginTop: hp(0.5),
  },
});