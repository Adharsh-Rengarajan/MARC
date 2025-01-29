import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup size="small" className={className}>
      <Button
        onClick={() => changeLanguage("en")}
        variant={i18n.language === "en" ? "contained" : "outlined"}
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage("hi")}
        variant={i18n.language === "hi" ? "contained" : "outlined"}
      >
        हि
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
