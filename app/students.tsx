import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Configuração da API base
const API_BASE_URL = 'http://192.168.0.105:8080';

interface Mae {
  nomeMae: string;
  enderecoMae: string;
  telefoneMae: string;
  trabalhoMae: string;
  telefoneTrabalhoMae: string;
}

interface Pai {
  nomePai: string;
  enderecoPai: string;
  telefonePai: string;
  trabalhoPai: string;
  telefoneTrabalhoPai: string;
}

interface Observacoes {
  temEspecialista: boolean;
  especialista: string;
  temAlergias: boolean;
  alergia: string;
  temMedicamento: boolean;
  Medicamento: string;
  reside: string;
  respNome: string;
  respTelefone: string;
  pessoasAutorizadas: string[];
}

interface Aluno {
  id: number;
  nome: string;
  sexo: string;
  cpf: string;
  rg: string;
  anoLetivo: string;
  turno: string;
  tipoSanguineo: string;
  mae: Mae;
  pai: Pai;
  observacoes: Observacoes;
}

export default function StudentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const [alunosRes, maesRes, paisRes, obsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/alunos/dto`),
        axios.get(`${API_BASE_URL}/maes/dto`),
        axios.get(`${API_BASE_URL}/pais/dto`),
        axios.get(`${API_BASE_URL}/observacoes/dto`)
      ]);

      const alunosCompletos = alunosRes.data.map((aluno: any) => ({
        ...aluno,
        mae: maesRes.data.find((m: any) => m.id === aluno.id),
        pai: paisRes.data.find((p: any) => p.id === aluno.id),
        observacoes: obsRes.data.find((o: any) => o.id === aluno.id)
      }));

      setAlunos(alunosCompletos);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const renderDetailModal = () => (
    <ScrollView style={styles.modalContainer}>
      {selectedAluno && (
        <>
          {/* Seção Aluno */}
          <Text style={styles.sectionTitle}>Dados do Aluno</Text>
          <DetailItem label="Nome" value={selectedAluno.nome} />
          <DetailItem label="Sexo" value={selectedAluno.sexo} />
          <DetailItem label="CPF" value={selectedAluno.cpf} />
          <DetailItem label="RG" value={selectedAluno.rg} />
          <DetailItem label="Ano Letivo" value={selectedAluno.anoLetivo} />
          <DetailItem label="Turno" value={selectedAluno.turno} />
          <DetailItem label="Tipo Sanguíneo" value={selectedAluno.tipoSanguineo} />

          {/* Seção Mãe */}
          <Text style={styles.sectionTitle}>Dados da Mãe</Text>
          <DetailItem label="Nome" value={selectedAluno.mae.nomeMae} />
          <DetailItem label="Endereço" value={selectedAluno.mae.enderecoMae} />
          <DetailItem label="Telefone" value={selectedAluno.mae.telefoneMae} />
          <DetailItem label="Trabalho" value={selectedAluno.mae.trabalhoMae} />
          <DetailItem label="Telefone Trabalho" value={selectedAluno.mae.telefoneTrabalhoMae} />

          {/* Seção Pai */}
          <Text style={styles.sectionTitle}>Dados do Pai</Text>
          <DetailItem label="Nome" value={selectedAluno.pai.nomePai} />
          <DetailItem label="Endereço" value={selectedAluno.pai.enderecoPai} />
          <DetailItem label="Telefone" value={selectedAluno.pai.telefonePai} />
          <DetailItem label="Trabalho" value={selectedAluno.pai.trabalhoPai} />
          <DetailItem label="Telefone Trabalho" value={selectedAluno.pai.telefoneTrabalhoPai} />

          {/* Seção Observações */}
          <Text style={styles.sectionTitle}>Observações</Text>
          <DetailItem label="Especialista" value={selectedAluno.observacoes.especialista} />
          <DetailItem label="Alergias" value={selectedAluno.observacoes.alergia} />
          <DetailItem label="Medicamentos" value={selectedAluno.observacoes.Medicamento} />
          <DetailItem label="Reside com" value={selectedAluno.observacoes.reside} />
          <DetailItem label="Responsável" value={selectedAluno.observacoes.respNome} />
          <DetailItem label="Telefone Responsável" value={selectedAluno.observacoes.respTelefone} />
          <DetailItem 
            label="Pessoas Autorizadas" 
            value={selectedAluno.observacoes.pessoasAutorizadas?.join(', ')} 
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedAluno(null)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#902121" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar aluno..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView>
        {alunos.filter(a => 
          a.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.cpf.includes(searchQuery)
        ).map(aluno => (
          <TouchableOpacity
            key={aluno.id}
            style={styles.card}
            onPress={() => setSelectedAluno(aluno)}
          >
            <Text style={styles.cardTitle}>{aluno.nome}</Text>
            <Text style={styles.cardSubtitle}>{aluno.turno} - {aluno.anoLetivo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedAluno && renderDetailModal()}
    </View>
  );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || 'Não informado'}</Text>
  </View>
);

// Estilos atualizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#902121',
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    width: '40%'
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    width: '55%',
    textAlign: 'right'
  },
  closeButton: {
    backgroundColor: '#902121',
    padding: 15,
    borderRadius: 8,
    marginTop: 20
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center'
  }
});