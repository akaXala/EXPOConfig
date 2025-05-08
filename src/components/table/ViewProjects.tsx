import { Table, TableContainer,TableHead } from "@mui/material";
import Paper from "@mui/material/Paper";
interface HeadCell {
    label: string;
  }


const headCells: readonly HeadCell[] = [
    {
      label: 'Protein (g)',
    },
    {
        label: 'Protein (g)',
    },
    {
        label: 'Protein (g)',
    },
  ];
  

function HeadTable(){
    <TableHead>
        
    </TableHead>
}
export default function ViewProjects(){
    return (
        <TableContainer component={Paper}>

        </TableContainer>
    )
}