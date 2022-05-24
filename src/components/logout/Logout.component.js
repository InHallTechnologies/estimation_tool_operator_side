import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogContentText, MenuItem } from '@mui/material';
import { firebaseAuth } from '../../backend/firebaseHandler';
import { signOut } from 'firebase/auth';
import userEntity from '../../Entities/userEntity';
import context from '../../context/app-context';

export default function Logout({name}) {
 
    const [open, setOpen] = React.useState(false);
    const [userData, setUserData] = React.useContext(context);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleLogout = async () => {
        handleClose();
        setUserData({...userEntity});
        await signOut(firebaseAuth);
    }

    return (
        <>
            <MenuItem onClick={handleOpen}>Logout</MenuItem>
            <Dialog onClose={handleClose} open={open}>
            <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to log out?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You will be logged out from this account. You can login again using your credentials
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={_ => {handleLogout()}} autoFocus>
                Yes
              </Button>
            </DialogActions>
            </Dialog>
        </>
    );
}


