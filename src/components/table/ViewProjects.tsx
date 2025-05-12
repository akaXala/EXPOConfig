import { Table, TableContainer,TableHead, TableRow, TableCell, TableSortLabel, TableBody, TablePagination} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { visuallyHidden } from '@mui/utils';
import React from "react";
interface Data {
  id: number;
  projectname: string;
  authors: string;
  teachers: string;
}
function createData(
  id: number,
  projectname: string,
  authors: string,
  teachers: string,
): Data {
  return {
    id, projectname,authors, teachers
  };
}
const rows = [
  createData(1, 'Proyecto 1', 'Luis, Pepe', 'José Manuel'),
  createData(2, 'Sistema de Inventario', 'Ana, Carlos', 'Laura Gómez'),
  createData(3, 'App de Finanzas', 'María, Jorge', 'Luis Herrera'),
  createData(4, 'Juego Educativo', 'Sofía, Andrés', 'Diego Díaz'),
  createData(5, 'Plataforma de Cursos', 'Emiliano, Valeria', 'Carmen Ruiz'),
  createData(6, 'Proyecto 1', 'Luis, Pepe', 'José Manuel'),
  createData(7, 'Sistema de Inventario', 'Ana, Carlos', 'Laura Gómez'),
  createData(8, 'App de Finanzas', 'María, Jorge', 'Luis Herrera'),
  createData(9, 'Juego Educativo', 'Sofía, Andrés', 'Diego Díaz'),
  createData(10, 'Plataforma de Cursos', 'Emiliano, Valeria', 'Carmen Ruiz'),
  createData(11, 'Proyecto 1', 'Luis, Pepe', 'José Manuel'),
  createData(12, 'Sistema de Inventario', 'Ana, Carlos', 'Laura Gómez'),
  createData(13, 'App de Finanzas', 'María, Jorge', 'Luis Herrera'),
  createData(14, 'Juego Educativo', 'Sofía, Andrés', 'Diego Díaz'),
  createData(15, 'Plataforma de Cursos', 'Emiliano, Valeria', 'Carmen Ruiz'),
  createData(16, 'Proyecto 1', 'Luis, Pepe', 'José Manuel'),
  createData(17, 'Sistema de Inventario', 'Ana, Carlos', 'Laura Gómez'),
  createData(18, 'App de Finanzas', 'María, Jorge', 'Luis Herrera'),
  createData(19, 'Juego Educativo', 'Sofía, Andrés', 'Diego Díaz'),
  createData(20, 'Plataforma de Cursos', 'Emiliano, Valeria', 'Carmen Ruiz'),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
interface HeadCell {
  id: keyof Data;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'projectname',
    label: 'Nombre del Proyecto',
  },
  {
    id: 'authors',
    label: 'Autor(es)',
  },
  {
    id: 'teachers',
    label: 'Profesor(es)',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {  order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding='normal'
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{width: '33%'}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


export default function ViewProjects(){
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('projectname');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage],
  );

    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
        <Table size= 'medium' aria-labelledby="tableTitle">
          <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
          <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow key={row.id}>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      align="left"
                    >
                      {row.projectname}
                    </TableCell>
                    <TableCell align="left">{row.authors}</TableCell>
                    <TableCell align="left">{row.teachers}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        
        </Paper>
        </Box>
    )
}