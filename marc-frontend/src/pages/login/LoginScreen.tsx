import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { RootState } from "../../redux/store/store";
import { login } from "../../redux/actions/loginActions";
import "./LoginScreen.scss";
import constructionGraphic from "../../assets/MARC.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.login
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(email, password, role) as any);
  };

  useEffect(() => {
    if (user) {
      const userEmail = user.email;
      switch (user.role) {
        case "owner":
          navigate("/owner-dashboard");
          break;
        case "manager":
          navigate("/managerProjects",{ state: { email: userEmail } });
          break;
        case "engineer":
          navigate("/engineer-dashboard/"+email.split("@")[0]);
          break;
        case "accountant":
          navigate("/accountant-dashboard");
          break;
        default:
          console.error("Invalid role");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src={constructionGraphic}
          alt="Construction Graphic"
          className="graphic-image"
        />
      </div>

      <div className="login-right">
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        <Typography variant="h5" component="h1" gutterBottom>
          {t("login.title")}
        </Typography>
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <TextField
              fullWidth
              label={t("login.email")}
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
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <FormControl fullWidth>
              <InputLabel id="role-select-label">{t("login.role")}</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="">{t("login.selectRole")}</MenuItem>

                <MenuItem value="engineer">{t("login.engineer")}</MenuItem>
                <MenuItem value="accountant">{t("login.accountant")}</MenuItem>
                <MenuItem value="owner">{t("login.contractor")}</MenuItem>
                <MenuItem value="manager">{t("login.projectManager")}</MenuItem>
              </Select>
            </FormControl>
          </div>
          {error && (
            <Typography color="error" variant="body2" className="error-message">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t("login.loginButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}
