import { useState, useEffect } from "react";
import { useGoogleAuth, useGApiContext } from "react-gapi-auth2";
import axios from "axios";

const useLogin = () => {
    const { googleAuth } = useGoogleAuth();
    const context = useGApiContext();
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        if (context?.isPlatformLoaded && context.isAuth2Loaded) {
            if (googleAuth?.isSignedIn.get()) {
                const currentUser = googleAuth.currentUser.get();
                // console.log(currentUser)
                if (currentUser.getAuthResponse()) {
                    axios.defaults.headers.common["Authorization"] =
                        currentUser.getAuthResponse().id_token;
                    setLoggedIn(true);
                }
            } else {
                delete axios.defaults.headers.common["Authorization"];
                setLoggedIn(false);
            }
        }
    }, [
        context,
        context?.isAuth2Loaded,
        context?.isPlatformLoaded,
        googleAuth?.isSignedIn.get(),
        googleAuth?.currentUser.get(),
    ]);

    return loggedIn;
};

export default useLogin;