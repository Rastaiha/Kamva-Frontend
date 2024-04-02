import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Stack, Typography } from '@mui/material';
import * as jose from 'jose'

const Statistics = () => {
  const { fsmId } = useParams();
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  var METABASE_SITE_URL = process.env.REACT_APP_METABASE_SITE_URL;
  var METABASE_SECRET_KEY = process.env.REACT_APP_METABASE_SECRET_KEY;

  var payload = {
    resource: { dashboard: 4 },
    params: {
      "fsm_id": fsmId
    }
  };

  const secret = new TextEncoder().encode(METABASE_SECRET_KEY);
  const alg = 'HS256';
  useEffect(() => {
    const setJwt = async () => {
      const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(Math.round(Date.now() / 1000) + (10 * 60)) // 10 minute expiration)
        .sign(secret);
      setToken(token);
    }
    setJwt();
  })

  if (token == null) return null;

  var iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#theme=transparent&bordered=false&titled=false";

  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      {!isLoaded &&
        <Stack alignItems={'center'} justifyContent={'center'} padding={4} spacing={1}>
          <CircularProgress />
          <Typography>
            {'Loading'}
          </Typography>
        </Stack>
      }
      <iframe
        loading={'eager'}
        onLoad={() => setIsLoaded(true)}
        src={iframeUrl}
        style={{ border: 0 }}
        width="100%"
        height={800}
      />
    </Stack>
  )
}

export default Statistics;