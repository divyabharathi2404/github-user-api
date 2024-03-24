import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Octokit } from "@octokit/core";
import { Avatar, Box, Card,CardActions, CardContent, Collapse, Container, Divider, IconButton, Stack, Typography, } from '@mui/material';
import { ExpandMore, GitHub, LocationOn, Person, Link, EmailOutlined, CorporateFare, ArrowBack, ExpandLess, ExpandLessOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ViewDetails() {
   const { userName } = useParams();
   const [expand, setExpand] = useState(false);
   const [userDtls, setUserDtls] = useState(null);

   useEffect(() => {
      const getUserList = async () => {
         try {
            let token = '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';

            const octokit = new Octokit({
               auth: token
            })
            const resss = await octokit.request('GET /users/{username}', {
               username: userName,
               headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
               }
            });
            const data1 = resss.data;
            setUserDtls(data1)
         } catch (error) {
            console.log("error", error)
         }
      }
      getUserList();
   }, [userName]);
   
   return (
      <>
         <div className='flex flex-col justify-center items-center gap-4 mt-4'>
            <header className='w-full h-10 m-8 flex justify-center'>
               <h1 className='text-4xl font-semibold  '>USER DETAILS</h1>
            </header>
         </div>
         <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <Card sx={{
               borderRadius: 4,
               marginBottom: 4
            }} >
               <CardContent sx={{
                  display: 'flex', flexDirection: 'column', gap: 2,
                  fontFamily: 'Inter',
                  paddingLeft: 4,
                  paddingRight: 4,

               }}>
                  <Box>
                     <IconButton
                        sx={{ color: 'green', float: "left" }}
                        href={"/github-user-api"}
                     >
                        <ArrowBack sx={{ width: 28, height: 28 }} />
                     </IconButton>
                  </Box>
                  <Box>

                     <Stack direction="column" justifyContent="space-between" alignItems="center">
                        <Avatar variant='circle' alt="profile" src={userDtls?.avatar_url}
                           sx={{
                              height: 140,
                              width: 140,
                              border: 3,
                              borderColor: 'green'
                           }} />
                        <Typography component="div"
                           sx={{
                              fontFamily: 'Inter',
                              fontSize: 20,
                              marginTop: 2,
                              fontWeight: 600,
                           }} >
                           {userDtls?.name}
                        </Typography>
                        <Typography component="div"
                           sx={{
                              fontFamily: 'Inter',
                              fontSize: 16,
                              color: 'green',
                              marginBottom: 2
                           }} >
                           {userDtls?.login}
                        </Typography>
                     </Stack>


                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="column" justifyContent="space-between" alignItems="center">
                           <Typography component="div"
                              sx={{
                                 fontFamily: 'Inter',
                                 fontSize: 16,
                                 marginTop: 2,
                                 fontWeight: 600
                              }} >
                              {userDtls?.followers
                                 ? userDtls?.followers : 0}
                           </Typography>
                           <Typography gutterBottom component="div"
                              sx={{
                                 fontFamily: 'Inter',
                                 fontSize: 14,
                                 fontWeight: 400
                              }}>
                              FOLLOWERS
                           </Typography>
                        </Stack>
                        <Divider orientation="vertical" flexItem />
                        <Stack direction="column" justifyContent="space-between" alignItems="center">
                           <Typography component="div"
                              sx={{
                                 fontFamily: 'Inter',
                                 fontSize: 16,
                                 marginTop: 2,
                                 fontWeight: 600
                              }} >
                              {userDtls?.following ? userDtls?.following : 0}
                           </Typography>
                           <Typography gutterBottom component="div"
                              sx={{
                                 fontFamily: 'Inter',
                                 fontSize: 14,
                                 fontWeight: 400
                              }}>
                              FOLLOWING
                           </Typography>
                        </Stack>
                     </Stack>
                  </Box>
                  <Divider orientation="horizontal" flexItem />
                  <Stack direction="column"
                     sx={{ gap: 2 }}>
                     <Typography variant="h6" component="div"
                        sx={{ fontFamily: 'Inter', fontSize: '16px', }}>
                        <LocationOn sx={{ color: 'green', marginRight: 2 }} />
                        {userDtls?.location}
                     </Typography>
                     <Typography variant="h6" component="div"
                        sx={{ fontFamily: 'Inter', fontSize: '16px', }}>
                        <EmailOutlined sx={{ color: 'green', marginRight: 2 }} />
                        {userDtls?.email}
                     </Typography>
                     <Typography variant="h6" component="div"
                        sx={{ fontFamily: 'Inter', fontSize: '16px', }}>
                        <Person sx={{ marginRight: 2 }} />
                        {userDtls?.type}
                     </Typography>
                     <Typography variant="h6" component="div"
                        sx={{ fontFamily: 'Inter', fontSize: '16px', gap: '404px' }}>
                        <GitHub spacing={4} sx={{ marginRight: 2 }} /> {userDtls?.html_url}
                     </Typography>
                  </Stack>

               </CardContent>
               {
                  !expand && (
                     <CardActions sx={{
                        float: 'right',
                        marginRight: 2,
                        marginBottom: 2
                     }}>
                        <ExpandMore
                           expand={expand}
                           onClick={() => { setExpand(!expand) }}
                           aria-expanded={expand}
                           aria-label="show more"
                        >
                           <ExpandMoreIcon />
                        </ExpandMore>
                     </CardActions>
                  )
               }
               <Collapse in={expand} timeout="auto" unmountOnExit>
                  <CardContent
                     sx={{
                        display: 'flex', flexDirection: 'column', gap: 2,
                        fontFamily: 'Inter',
                        paddingLeft: 4,
                        paddingRight: 4,
                     }}>
                     <Stack direction='row'>
                        <CorporateFare />
                        <Stack direction='column'
                           sx={{ marginLeft: 2 }}>
                           {
                              userDtls?.company?.split(',')?.map((cmp, idx) => {
                                 return (
                                    <Typography component="div"
                                       sx={{ fontFamily: 'Inter', fontSize: '16px', }}>
                                       {cmp}
                                    </Typography>
                                 )
                              })
                           }
                        </Stack>

                     </Stack>

                     <Divider orientation="horizontal" flexItem />
                     <Stack direction="column" >
                        <Typography variant="h5" component="div"
                           sx={{
                              fontFamily: 'Inter', fontSize: '18px',
                              fontWeight: 600
                           }}>
                           {`Github Statistics`}
                        </Typography>

                        <Typography component="div">
                           <span className='text-sm font-semibold bg-red-400 p-1 rounded-lg text-white mr-2'> Public Gists</span>
                           {userDtls?.public_gists}

                           <IconButton
                              sx={{ color: 'green', }}
                              href={`/`}
                           >
                              <Link sx={{ width: 28, height: 30 }} />
                           </IconButton>
                        </Typography>

                        <Typography component="div">
                           <span className='text-sm font-semibold bg-red-400 p-1 rounded-lg text-white mr-2'> Public Repos</span>
                           {userDtls?.public_repos}
                           <IconButton
                              sx={{ color: 'green', }}
                              href={`/`}
                           >
                              <Link sx={{ width: 28, height: 30 }} />
                           </IconButton>
                        </Typography>
                     </Stack>


                  </CardContent>
                  {
                     expand && (
                        <CardActions sx={{
                           float: 'right',
                           marginRight: 2,
                           marginBottom: 2
                        }}>
                           <ExpandLess
                              expand={expand}
                              onClick={() => { setExpand(!expand) }}
                              aria-expanded={expand}
                              aria-label="show more"
                           >
                              <ExpandLessOutlined />
                           </ExpandLess>
                        </CardActions>
                     )
                  }
               </Collapse>
            </Card>
         </Container>
      </>
   )
}