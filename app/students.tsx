import React, { useEffect, useState, FC } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios, { AxiosError } from 'axios';

const API_URL = 'http://192.168.0.105:8080';

// Interfaces de tipos
interface Aluno {
  id: number;
  nome: string;
  sexo: string;
  cpf: string;
  rg: string;
  anoLetivo: string;
  turno: string;
  tipoSanguineo: string;
}

interface Mae {
  idMae: number;
  nomeMae: string;
  enderecoMae: string;
  telefoneMae: string;
  trabalhoMae: string;
  telefoneTrabalhoMae: string;
}

interface Pai {
  idPai: number;
  nomePai: string;
  enderecoPai: string;
  telefonePai: string;
  trabalhoPai: string;
  telefoneTrabalhoPai: string;
}

interface Observacao {
  idObservacoes: number;
  temEspecialista: boolean;
  especialista?: string;
  temAlergias: boolean;
  alergia?: string;
  temMedicamento: boolean;
  medicamento?: string;
  reside?: string;
  respNome?: string;
  respTelefone?: string;
  pessoasAutorizadas?: string[] | string;
}

// Tipo unificado que combina todos os dados
interface StudentData extends Aluno {
  mae: Mae;
  pai: Pai;
  observacao: Observacao;
}

const StudentsScreen: FC = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunosRes, maesRes, paisRes, obsRes] = await Promise.all([
          axios.get<Aluno[]>(`${API_URL}/alunos`),
          axios.get<Mae[]>(`${API_URL}/maes`),
          axios.get<Pai[]>(`${API_URL}/pais`),
          axios.get<Observacao[]>(`${API_URL}/observacoes`),
        ]);

        const alunos = alunosRes.data;
        const maes = maesRes.data;
        const pais = paisRes.data;
        const observacoes = obsRes.data;

        // Merge por ID
        const merged: StudentData[] = alunos.map(aluno => {
          const mae = maes.find(m => m.idMae === aluno.id) ?? ({} as Mae);
          const pai = pais.find(p => p.idPai === aluno.id) ?? ({} as Pai);
          const obs = observacoes.find(o => o.idObservacoes === aluno.id) ?? ({} as Observacao);

          return {
            ...aluno,
            mae,
            pai,
            observacao: obs,
          };
        });

        setData(merged);
      } catch (err: unknown) {
        // Tratar erro genérico
        if (axios.isAxiosError(err)) {
          setError(err as AxiosError);
        } else {
          setError(new Error('Erro desconhecido ao buscar dados'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{`Erro ao carregar dados: ${error.message}`}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: StudentData }) => {
    const obs = item.observacao;
    const autorizadas = obs.pessoasAutorizadas;
    let autorizadasText = '—';

    if (Array.isArray(autorizadas)) {
      autorizadasText = autorizadas.join(', ');
    } else if (typeof autorizadas === 'string') {
      autorizadasText = autorizadas;
    }

    return (
      <View style={styles.card}>
        {/* Aluno */}
        <Text style={styles.title}>{item.nome}</Text>
        <Text>Sexo: {item.sexo}</Text>
        <Text>CPF: {item.cpf}</Text>
        <Text>RG: {item.rg}</Text>
        <Text>Ano Letivo: {item.anoLetivo}</Text>
        <Text>Turno: {item.turno}</Text>
        <Text>Tipo Sanguíneo: {item.tipoSanguineo}</Text>

        {/* Mãe */}
        <Text style={styles.subtitle}>Mãe:</Text>
        <Text>Nome: {item.mae.nomeMae}</Text>
        <Text>Endereço: {item.mae.enderecoMae}</Text>
        <Text>Telefone: {item.mae.telefoneMae}</Text>
        <Text>Trabalho: {item.mae.trabalhoMae}</Text>
        <Text>Tel. Trabalho: {item.mae.telefoneTrabalhoMae}</Text>

        {/* Pai */}
        <Text style={styles.subtitle}>Pai:</Text>
        <Text>Nome: {item.pai.nomePai}</Text>
        <Text>Endereço: {item.pai.enderecoPai}</Text>
        <Text>Telefone: {item.pai.telefonePai}</Text>
        <Text>Trabalho: {item.pai.trabalhoPai}</Text>
        <Text>Tel. Trabalho: {item.pai.telefoneTrabalhoPai}</Text>

        {/* Observações */}
        <Text style={styles.subtitle}>Observações:</Text>
        <Text>Tem Especialista: {obs.temEspecialista ? 'Sim' : 'Não'}</Text>
        {obs.temEspecialista && <Text>Especialista: {obs.especialista}</Text>}
        <Text>Tem Alergias: {obs.temAlergias ? 'Sim' : 'Não'}</Text>
        {obs.temAlergias && <Text>Alergia: {obs.alergia}</Text>}
        <Text>Tem Medicamento: {obs.temMedicamento ? 'Sim' : 'Não'}</Text>
        {obs.temMedicamento && <Text>Medicamento: {obs.medicamento}</Text>}
        <Text>Reside: {obs.reside}</Text>
        <Text>Responsável: {obs.respNome} - {obs.respTelefone}</Text>
        <Text>Pessoas Autorizadas: {autorizadasText}</Text>
      </View>
    );
  };

  return (
    <FlatList<StudentData>
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentsScreen;
