import { Dialog } from "@headlessui/react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt from "jwt-decode";
import { User } from "../util/interfaces";

interface LoginDialogProps {
  user?: User;
  setUser: (user: User) => void;
}

const LoginDialog = ({ user, setUser }: LoginDialogProps) => {
  return (
    <Dialog open={!user} onClose={() => {}}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="rounded-lg bg-white p-4">
          <div className="text-lg font-medium">Sign In</div>
          <div className="mt-1">
            <GoogleLogin
              onSuccess={(res) => {
                axios.defaults.headers.common["Authorization"] = res.credential;
                const decoded: any = jwt(res.credential ?? "");
                const user: User = {
                  id: decoded.sub,
                  name: decoded.name,
                  email: decoded.email,
                  pictureUrl: decoded.picture,
                };
                console.log(decoded);
                setUser(user);
              }}
              useOneTap
              auto_select
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default LoginDialog;
