import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, TablePagination, Box, useTheme, Typography } from '@mui/material';


function ProblemsTable() {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [filter, setFilter] = useState({ title: '', tags: '', difficulty: '', rating: '', solved: '' });

  const fetchProblems = async () => {
    const query = new URLSearchParams({
      page: page + 1,
      per_page: rowsPerPage,
      ...filter 
    }).toString();
    const response = await axios.get(`https://kep.uz/api/problems?${query}`);
    setProblems(response.data.data);
    setTotalRows(response.data.total);
  };

  useEffect(() => {
    fetchProblems();
  }, [page, rowsPerPage, filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

const theme = useTheme();

const headerStyle = {
  bgcolor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  fontWeight: 'bold'
};

const filterBoxStyle = {
  mb: 3, 
  display: 'flex', 
  gap: 2, 
  flexWrap: 'wrap', 
  bgcolor: theme.palette.background.default, 
  p: 2, 
  borderRadius: '4px', 
  boxShadow: 2
};

const filterInputStyle = {
  flex: 1, 
  minWidth: '150px', 
  bgcolor: theme.palette.background.paper, 
  borderRadius: '4px'
};

const searchButtonStyle = {
  flexShrink: 0, 
  alignSelf: 'end', 
  bgcolor: theme.palette.secondary.main, 
  '&:hover': { bgcolor: theme.palette.secondary.dark }
};

return (
  <Paper sx={{ width: '100%', mt: 4, p: 2, boxShadow: 3, bgcolor: 'background.default' }}>
    <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>Created by Boltayev Abrorbek</Typography>
    <Box sx={filterBoxStyle}>
      <TextField label="Title" variant="outlined" name="title" onChange={handleFilterChange} sx={filterInputStyle} />
      {/* <TextField label="Tags" variant="outlined" name="tags" onChange={handleFilterChange} sx={filterInputStyle} /> */}
      <TextField label="Difficulty" variant="outlined" name="difficulty" onChange={handleFilterChange} sx={filterInputStyle} />
      {/* <TextField label="Rating" variant="outlined" name="rating" onChange={handleFilterChange} sx={filterInputStyle} /> */}
      {/* <TextField label="Solved" variant="outlined" name="solved" onChange={handleFilterChange} sx={filterInputStyle} /> */}
      <Button variant="contained" color="secondary" onClick={() => fetchProblems()} sx={searchButtonStyle}>Search</Button>
    </Box>
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow sx={headerStyle}>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Solved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems.map((problem) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={problem.id}>
              <TableCell>{problem.id}</TableCell>
              <TableCell>{problem.title}</TableCell>
              <TableCell>
                {/* {problem.tags.join(', ')} */}
                {problem.tags.map((item, i) => <span className='tags_span' key={i}>{item.name}</span>)}
              </TableCell>
              <TableCell>{problem.difficultyTitle}</TableCell>
              <TableCell>
                {
                  <>
                    <span className='rating like'>{problem.likesCount} <AiFillLike /></span>
                    <span className='rating dislike'>{problem.dislikesCount} <AiFillDislike /></span>
                  </>
                }
              </TableCell>
              <TableCell>{problem.solved}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={totalRows}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
);
}

export default ProblemsTable;