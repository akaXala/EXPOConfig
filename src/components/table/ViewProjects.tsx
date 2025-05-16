'use client';

import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect, useState, useMemo } from 'react';
// Agrega al principio
import ProjectModal from '@/components/table/ProjectModal'; // Ajusta la ruta según tu estructura



type Project = {
  idproyecto: number;
  estudiante: string;
  nombre_proyecto: string;
  ua: string;
  grupo: string;
  academia: string;
  profesor: string;
};

type ProjectParse = {
  id: number;
  estudiante: string;
  titulo: string;
  materia: string;
  semestre: string;
  carrera: string;
  academia: string;
  profesor: string;
};

function parseData(data: Project[]): ProjectParse[] {
  return data.map((item) => {
    const carrera =
      item.grupo.charAt(1) === 'A'
        ? 'Ciencia de datos'
        : item.grupo.charAt(1) === 'B'
        ? 'Inteligencia Artificial'
        : 'Sistemas Computacionales';

    return {
      id: item.idproyecto,
      estudiante: item.estudiante,
      titulo: item.nombre_proyecto,
      materia: item.ua,
      semestre: item.grupo.charAt(0),
      carrera,
      academia: item.academia,
      profesor: item.profesor,
    };
  });
}

const ITEMS_PER_PAGE = 5;

const ViewProject = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleOpenModal = (id: number) => {
    setSelectedProjectId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [parsedProjects, setProjects] = useState<ProjectParse[]>([]);
  const [filteredOption, setFilteredOptions] = useState<Map<string, string[]>>(new Map());
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    academia: '',
    semestre: '',
    carrera: '',
    materia: '',
    profesor: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProjectParse; direction: 'asc' | 'desc' }>({
    key: 'titulo',
    direction: 'asc',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/proyectos/dashboardProjects');
      const data: Project[] = await res.json();
      const parsedData: ProjectParse[] = parseData(data);

      const filteredOptions = new Map<string, string[]>();
      filteredOptions.set('academia', [...new Set(parsedData.map((p) => p.academia))]);
      filteredOptions.set('semestre', [...new Set(parsedData.map((p) => p.semestre))]);
      filteredOptions.set('carrera', [...new Set(parsedData.map((p) => p.carrera))]);
      filteredOptions.set('materia', [...new Set(parsedData.map((p) => p.materia))]);
      filteredOptions.set('profesor', [...new Set(parsedData.map((p) => p.profesor))]);

      setProjects(parsedData);
      setFilteredOptions(filteredOptions);
    };

    fetchData();
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSort = (key: keyof ProjectParse) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredProjects = useMemo(() => {
    return parsedProjects.filter((project) => {
      return (
        Object.entries(filters).every(([key, value]) =>
          value === '' ? true : project[key as keyof typeof filters] === value
        ) &&
        [project.titulo, project.estudiante, project.profesor].some(field =>
         field.toLowerCase().includes(search.toLowerCase())
      )

      );
    });
  }, [parsedProjects, filters, search]);

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      return sortConfig.direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredProjects, sortConfig]);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProjects, page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <Box p={1}>
      <TextField
        fullWidth
        size='small'
        placeholder="Buscar proyectos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={3}>
        {(['academia', 'semestre', 'carrera', 'materia', 'profesor'] as const).map((key) => (
          <TextField
            key={key}
            select
            size='small'
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={filters[key]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {(filteredOption.get(key) || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {(['titulo', 'estudiante', 'profesor'] as const).map((key) => (
                <TableCell key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <IconButton onClick={() => handleSort(key)} size="small">
                    {sortConfig.key === key && sortConfig.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.titulo}</TableCell>
                <TableCell>{project.estudiante}</TableCell>
                <TableCell>{project.profesor}</TableCell>
                <TableCell>
                  <Button variant='contained' onClick={() => handleOpenModal(project.id)}>
                    ver
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {selectedProjectId !== null && (
        <ProjectModal
          open={modalOpen}
          onClose={handleCloseModal}
          projectId={selectedProjectId}
        />
      )}
    </Box>
  );
};

export default ViewProject;
