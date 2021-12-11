import { Dialog, DialogContent, DialogTitle, DialogContentText, Stack, Divider, Button, Typography, Link } from "@mui/material";

export default function SubmissionInstructions({open, close}){
    return (
        <Dialog open={open}>
            <DialogTitle>Submission Instructions</DialogTitle>
            <DialogContent>
                <Typography mb={1} >Problem Statement</Typography>
                <DialogContentText >
                    <Stack spacing={1}>
                    <li>You can obtain the problem statement ID by clicking <Link href="https://hack4good.ieee-cis-sbc.org/problem-statements" target="_blank">here</Link></li>
                    <li>You can also select different problem statement (Out of Box) by entering the problem statement ID as "OB"</li>
                    <li>Solutions to the OB (Out of Box) problem statements must contribute to the society.</li>
                    <Divider/>
                    </Stack>
                </DialogContentText>
                <Typography my={1} >Project Links</Typography>
                <DialogContentText >
                    <Stack spacing={1}>
                    <li>You need to push your source code of the prototype in the assigned GitHub repository only. </li>
                    <li>The length of the project demonstration video must not exceed than 5 minutes. </li>
                    <li>You can upload your video on any Cloud Storage (eg. Google Drive) and provide it's shareable link. </li>
                    <li>Make sure that your video is accessible to anyone.</li>
                    </Stack>
                </DialogContentText>
                <Button onClick={close} sx={{float : "right"}}>Close</Button>
            </DialogContent>
        </Dialog>
    )
}