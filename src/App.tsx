import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {Button, Container, FormControlLabel, Switch, TextField, Typography,} from "@material-ui/core";
import Signature from "./Signature";
import {CheckOutlined, FileCopyOutlined, GetApp} from "@material-ui/icons";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import "./App.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
            },
            "& .label-root": {
                margin: theme.spacing(1),
            },
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: "left",
            color: theme.palette.text.secondary,
        },
        centeredImage: {
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "150px",
            height: "150px",
        },
        centeredText: {
            textAlign: "center",
        },
        warningIconStyle: {
            textAlign: "center",
            color: "#FFDC00",
            verticalAlign: "middle",
        },
    })
);

export interface PhotoSignatureProps {
    fullName: string;
    position: string;
    address: string;
    email: string;
    site: string;
    phone: string;
    photo: string;
    fbUrl: string;
    inUrl: string;
}

interface State extends PhotoSignatureProps {
    withPhoto: boolean;
    copied: boolean;
}

const initialState: State = {
    fullName: "",
    position: "",
    address: "",
    email: "",
    site: "",
    phone: "",
    fbUrl: "",
    inUrl: "",
    photo: "",
    withPhoto: false,
    copied: false,
};

function App() {
    const classes = useStyles();
    const [state, setState] = React.useState<State>(initialState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "withPhoto") {
            setState((prevState) => ({
                ...prevState,
                [event.target.name]: event.target.checked,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                [event.target.name]: event.target.value,
            }));
        }
    };

    const enoughData = () => {
        let progress = 100;
        if (state.withPhoto) {
            if (
                state.fullName &&
                state.phone &&
                state.position &&
                state.address &&
                state.phone &&
                state.photo
            ) {
                return (
                    <React.Fragment>
                        <Signature
                            fullName={state.fullName}
                            position={state.position}
                            address={state.address}
                            email={state.email}
                            site={state.site}
                            phone={state.phone}
                            photo={state.photo}
                            fbUrl={state.fbUrl}
                            inUrl={state.inUrl}
                        />
                        <br/>
                        <Button
                            disabled={state.photo.length > photoUrlMaxLength}
                            onClick={copyToClipboard}
                            endIcon={state.copied ? <CheckOutlined/> : <FileCopyOutlined/>}
                        >
                            {state.copied ? "Copied" : "Copy to clipboard"}
                        </Button>
                        <Button
                            disabled={state.photo.length > photoUrlMaxLength}
                            onClick={download}
                            endIcon={<GetApp/>}
                        >
                            Download html
                        </Button>
                    </React.Fragment>
                );
            } else {
                Object.entries(state).forEach(([key, value]) => {
                    if (
                        ["fullName", "phone", "position", "address", "email","photo"].includes(key)
                    ) {
                        if (value.length === 0) {
                            progress = progress - 20;
                        }
                    }
                });
            }
        } else {
            if (state.fullName && state.phone && state.position && state.address) {
                return (
                    <React.Fragment>
                        <Signature
                            fullName={state.fullName}
                            position={state.position}
                            address={state.address}
                            email={state.email}
                            site={state.site}
                            phone={state.phone}
                            photo={"no-photo"}
                            fbUrl={state.fbUrl}
                            inUrl={state.inUrl}
                        />
                        <br/>
                        <Button
                            onClick={copyToClipboard}
                            endIcon={state.copied ? <CheckOutlined/> : <FileCopyOutlined/>}
                        >
                            {state.copied ? "Copied" : "Copy to clipboard"}
                        </Button>
                        <Button
                            disabled={state.photo.length > photoUrlMaxLength}
                            onClick={download}
                            endIcon={<GetApp/>}
                        >
                            Download html
                        </Button>
                        
                    </React.Fragment>
                );
            } else {
                Object.entries(state).forEach(([key, value]) => {
                    if (["fullName", "phone", "position", "address"].includes(key)) {
                        if (value.length === 0) {
                            progress = progress - 25;
                        }
                    }
                });
            }
        }
        if (progress > 0) {
            return (
                <div className={classes.centeredText}>
                    <CircularProgressWithLabel variant="determinate" value={progress}/>
                </div>
            );
        } else {
            return <div>Please, input your data</div>;
        }
    };

    const download = () => {
        const htmlElement = document.getElementById('signatureId');
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + `${htmlElement?.innerHTML}`);
        element.setAttribute('download', 'signature.html');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }
      
      // Start file download.

    const copyToClipboard = () => {
        let copyText = document.querySelector(".signature");
        const range = document.createRange();
        if (copyText) {
            range.selectNode(copyText);
        }
        const windowSelection = window.getSelection();
        if (windowSelection) {
            windowSelection.removeAllRanges();
            windowSelection.addRange(range);
        }
        try {
            let successful = document.execCommand("copy");
            console.log(successful ? "Success" : "Fail");
            setState((prevState) => ({
                ...prevState,
                copied: true,
            }));
        } catch (err) {
            console.log("Fail");
        }
    };

    const isStateChanged = () => {
        return JSON.stringify(state) === JSON.stringify(initialState);
    };

    const clearState = () => {
        setState(initialState);
    };

    const photoUrlMaxLength = 1000;

    return (
        <Container>
            <img className={classes.centeredImage} src="https://storage.googleapis.com/web-landing-cdn/icons/webtronic-logo.png" alt={"logo"}/>
            <Typography variant="h2" gutterBottom className={classes.centeredText}>
                Signature generator
            </Typography>
            <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.centeredText}
            >
                Create your personal signature
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <form className={classes.root} noValidate autoComplete="off">
                            <TextField
                                fullWidth={true}
                                required
                                label="Full Name"
                                value={state.fullName}
                                name={"fullName"}
                                onChange={handleChange}
                                autoFocus={true}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="Position"
                                value={state.position}
                                name={"position"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="address"
                                value={state.address}
                                name={"address"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="email"
                                value={state.email}
                                name={"email"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="Company site or porfolio online"
                                value={state.site}
                                name={"site"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="Telephone"
                                value={state.phone}
                                name={"phone"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="Facebook profile"
                                value={state.fbUrl}
                                name={"fbUrl"}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth={true}
                                required
                                label="LinkedIn profile"
                                value={state.inUrl}
                                name={"inUrl"}
                                onChange={handleChange}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={state.withPhoto}
                                        onChange={handleChange}
                                        name="withPhoto"
                                        color="primary"
                                    />
                                }
                                label={state.withPhoto ? "Change photo" : "No photo"}
                            />
                            {state.withPhoto && (
                                <TextField
                                    error={state.photo.length > photoUrlMaxLength}
                                    fullWidth={true}
                                    required
                                    label="Link to image"
                                    value={state.photo}
                                    name={"photo"}
                                    onChange={handleChange}
                                    helperText={
                                        state.photo.length > photoUrlMaxLength &&
                                        "It's not an image url, but, probably, image in base64 form. Please, choose appropriate data."
                                    }
                                />
                            )}
                            <br/>
                            <Button
                                disabled={isStateChanged()}
                                onClick={clearState}
                                color={"secondary"}
                            >
                                Clear
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>{enoughData()}</Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
