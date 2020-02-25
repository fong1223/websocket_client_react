import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 400
    },
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  button: {
    margin: theme.spacing(1),
    textAlign: "center"
  },
  xsbutton: {
    margin: theme.spacing(1),
    textAlign: "center",
    width: 50
  }
}));

export default function WebSocketClient() {
  const classes = useStyles();

  const [connected, setConnected] = React.useState(false);
  const [statusText, setStatusText] = React.useState("Closed");
  const [workerText, setWorkerText] = React.useState("Stoped");

  const [url, setUrl] = React.useState("wss://self.turn2cloud.com:8080");
  const [message, setMessage] = React.useState("");
  const [interval, setSendInterval] = React.useState(1000);

  const [timer, setTimer] = React.useState(null);
  const [websocket, setWebsocket] = React.useState(null);

  const onMessage = e => {
    try {
      console.log(e.data);
    } catch (error) {
      console.log("Error: " + error);
    }

    //console.log(json[]);
  };
  const onOpen = () => {
    setStatusText("Connected");
    setConnected(true);
  };
  const onClose = () => {
    onDisconnect();
  };

  const onConnect = e => {
    console.log("Connect to remote:" + url);
    const ws = new WebSocket(url);
    setWebsocket(ws);

    // Register event handler
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
  };

  const onDisconnect = e => {
    closeAll();
  };

  const onStart = () => {
    setWorkerText("Running");
    sendMessageLoop();
  };

  const onStop = () => {
    setWorkerText("Stoped");
    if (timer) {
      clearInterval(timer);
    }
    setTimer(null);
  };

  const onUrlChange = e => {
    setUrl(e.target.value);
  };

  const onMessageChange = e => {
    setMessage(e.target.value);
  };

  const onIntervalChage = e => {
    setSendInterval(e.target.value);
  };

  const sendMessageLoop = () => {
    console.log("Start loop with interval as " + interval + "ms");
    setTimer(
      setInterval(() => {
        if (websocket.readyState === 1) {
          websocket.send(message);
        }
      }, interval)
    );
  };

  const closeAll = () => {
    setConnected(false);
    setStatusText("Closed");
    setWorkerText("Stoped");
    if (websocket) {
      websocket.close();
    }
    if (timer) {
      clearInterval(timer);
    }
    setWebsocket(null);
    setTimer(null);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid container item>
          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Remote URL"
              defaultValue="wss://self.turn2cloud.com:8080"
              variant="outlined"
              onChange={onUrlChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography color="inherit">
              Connection Status: {statusText}
            </Typography>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={onConnect}
              disabled={connected}
            >
              Connect
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={onDisconnect}
              disabled={!connected}
            >
              Disconnect
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-static"
            label="Message"
            defaultValue=""
            multiline
            rows="8"
            variant="outlined"
            disabled={!connected}
            onChange={onMessageChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.xsbutton}
            id="outlined-number"
            label="Interval (MS)"
            type="number"
            defaultValue={1000}
            disabled={!connected}
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            onChange={onIntervalChage}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography color={timer === null ? "inherit" : "secondary"}>
            Worker Status: {workerText}
          </Typography>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={onStart}
            disabled={!connected || timer !== null}
          >
            Start
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={onStop}
            disabled={!connected || timer === null}
          >
            Stop
          </Button>
        </Grid>
      </Grid>
      {/* <div>
        <WebSocket
          url={url}
          onOpen={handleOpen}
          onClose={handleClose}
          onMessage={handleData}
          reconnect={false}
          debug={true}
          ref={Websocket => {
            setWebsocket(Websocket);
          }}
        />
      </div> */}
    </form>
  );
}
