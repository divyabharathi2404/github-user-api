import React, { useEffect, useState } from 'react';
import { Avatar, Stack, Card, CardActions, CardHeader, Container, Grid, IconButton, Typography, Pagination } from '@mui/material';
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
  useEffect(() => {
    const getUserList = async () => {
      try {
        setError(null);
        // let token = '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';
        let headers = {
          'content-type': "application/vnd.github+json",
          'Authorization': "Bearer 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"
        }
        const resp = await fetch('https://api.github.com/users', {
          method: 'GET',
          headers: headers,
        });
        const data = await resp.json();

        setUserList(data);
        setSkip(true);
        setPageCount(parseInt(data?.length / 6));
        let dtlsList = [];
        for (let i = 0; i < 6; i++) {
          dtlsList.push(data[i])
        }
        setPageDtls(dtlsList)
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
                                    navigate(`/${user?.login}`)
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