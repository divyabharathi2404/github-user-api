import React, { useEffect, useState } from 'react';
import { Octokit } from "@octokit/core";
import { Avatar, Stack, Card, CardActions, CardHeader, Container, Grid, IconButton, Typography, Pagination,Box, TextField, Button ,Input} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleRight } from '@mui/icons-material';

export default function UserList() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageDtls, setPageDtls] = useState([]);
  const [skip, setSkip] = useState(false);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({
    userName:'',
    location:''
  });
  const paginationData= (data) => {
    setPageCount(parseInt(data?.length / 6));
    let dtlsList = [];
    for (let i = 0; i < 6; i++) {
      dtlsList.push(data[i])
    }
    setPageDtls(dtlsList);
  }
  useEffect(() => {
    const getUserList = async () => {
      try {
        setError(null);
       
       // token = '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';
      
        const octokit = new Octokit({
          auth: process.env.REACT_APP_TOKEN
        })
        const res = await octokit.request('GET /users', {
           headers: {
              'X-GitHub-Api-Version': '2022-11-28'
           }
        });
        const data = res.data;
        setUserList(data);
        setSkip(true);
        paginationData(data)
      } catch (error) {
        setError(error?.message)
      }
    }
    if (!skip) {
      getUserList();
    }

  }, [skip]);

  const HandlePageDtls = (page) => {
    let initalVal = 6 * (page - 1) + 1;
    let finalVal = (initalVal + 6) < userList?.length ? (initalVal + 6) : userList?.length;
    let dtlsList = [];
    for (let i = initalVal; i < finalVal; i++) {
      dtlsList.push(userList[i])
    }
    setPageDtls(dtlsList);
  }
  const handleSearchData= (event) => {
    setSearchData ({
        ...searchData,
        [`${event.target.name}`]: event.target.value
      });
  }
  const handleSubmit = async () => {
      const octokit = new Octokit({
        auth: process.env.REACT_APP_TOKEN
      });
      let uri = '/search/users' 
      let uriParams = (searchData.userName && searchData.location ) 
            ? `?q=${searchData.userName}+location:${searchData.location}`
            : searchData.userName 
              ? `?q=${searchData.userName}`
              : searchData.location 
                ? `?q=location:${searchData.location}`
                : '' ;
      if(uriParams) {
        uri = uri+uriParams
      }else{
        uri = '/users'
      }
      const res = await octokit.request(`GET ${uri}`, {
         headers: {
            'X-GitHub-Api-Version': '2022-11-28'
         }
      });
      const data = res.data;
      if(uri === '/users'){
        paginationData(data);
        setUserList(data);
      }else{
        paginationData(data.items);
        setUserList(data.items);
      }
      
  }
  return (
    <>
      {
        error ?
          ( <Typography variant="h2" component= "div" sx={{color:'red'}}>
            {error}
            </Typography>
          ):(
            <>
              <div className='flex flex-col justify-center items-center gap-4 mt-4'>
                <header className='w-full h-10 m-8 flex justify-center'>
                  <h1 className='text-4xl font-semibold'>USER LIST</h1>
                </header>
              </div>
              <Container sx={{ paddingBottom: 10 }}>
                <Box sx={{marginBottom:8}}>
                <Stack direction="row" justifyContent="space-around" alignItems="center"> 
                    <Input  name="userName" placeholder="User Name" variant="contained" onChange={(e) => {
                      e.preventDefault();
                      handleSearchData(e);
                    }}/>
                  <Input  name="location" label="Location" placeholder="Location" variant="contained" onChange={(e) => {
                      e.preventDefault();
                      handleSearchData(e);
                    }}/>
                    
                    <Button variant="contained"  onClick={(e)=> {
                      e.preventDefault();
                      handleSubmit(e);
                    }}>Search</Button>
                </Stack>
                </Box>
                <Grid container columnSpacing={4} rowSpacing={2} columns={{ xs: 2, sm: 8, md: 12 }}>
                  {
                    pageDtls?.length > 0
                      ? pageDtls?.map((user, idx) => {
                        return (
                          <Grid item xs={2} sm={4} md={4}>
                            <Card key={idx}
                            >
                              <CardHeader
                                sx={{ display: 'flex', flexDirection: 'row', marginLeft: 2 }}
                                avatar={
                                  <Avatar className="" alt="profile" src={user?.avatar_url} sx={{
                                    height: 100,
                                    width: 100,
                                    border: 2, borderColor: 'green',
                                  }} />
                                }
                                title={
                                  <Typography variant="h6" component="div"
                                    sx={{
                                      marginLeft: 2,
                                      fontWeight: 800,
                                      fontSize: 24,
                                      textTransform: 'capitalize'
                                    }}>
                                    {user?.login}
                                  </Typography>
                                }

                              />
                              <CardActions
                                sx={{ float: "right", marginRight: 2 }}>
                                <IconButton
                                  sx={{ color: 'green', }}
                                  onClick={() => {
                                    navigate(`/github-user-api/${user?.login}`)
                                  }}>
                                  <ArrowCircleRight sx={{ width: 28, height: 30 }} />
                                </IconButton>
                              </CardActions>
                            </Card>

                          </Grid >
                        )
                      })
                      : null
                  }

                </Grid>
                {pageDtls?.length > 0
                  && (
                    <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                      <Pagination count={pageCount} page={page} onChange={(e, value) => {
                        e.preventDefault();
                        setPage(value);
                        HandlePageDtls(value);
                      }} />
                    </Stack>
                  )}
              </Container>
            </>
          )
      }

    </>
  );
}
