import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, CircularProgress, TextField, Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../redux/store/store";
import { login } from "../../redux/actions/authActions";
import "./LoginScreen.scss";

const roleHome: Record<string, string> = {
  owner: "/owner",
  manager: "/manager",
  engineer: "/engineer",
  accountant: "/accountant",
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from || roleHome[user.role] || "/login", { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(email, password));
    } catch {
      /* error shown via redux */
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="graphic-block">
          <div className="brand-mark">MARC</div>
          <div className="brand-tag">Construction Management Platform</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <Typography variant="h4" component="h1">
            {t("login.title")}
          </Typography>
          <Typography className="subtitle" variant="body2">
            Sign in to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <TextField
                fullWidth
                label={t("login.email")}
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <TextField
                fullWidth
                label={t("login.password")}
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Typography className="error-message" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="login-button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : t("login.loginButton")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
