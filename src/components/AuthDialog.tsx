import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

type AuthRole = "user" | "mentor";

type AuthDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	role: AuthRole;
};

export const AuthDialog = ({ open, onOpenChange, role }: AuthDialogProps) => {
	const { t } = useTranslation();
	const { signup, login } = useAuth();
	const navigate = useNavigate();

	const roleTitle = useMemo(() => {
		return role === "mentor" ? t("auth.role.mentor") : t("auth.role.user");
	}, [role, t]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-background/80 backdrop-blur-sm border-primary/20">
				<DialogHeader>
					<DialogTitle className="text-2xl">
						{t("auth.title", { role: roleTitle })}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{t("auth.subtitle")}
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="login" className="mt-4">
					<TabsList className="grid grid-cols-2 w-full">
						<TabsTrigger value="login">{t("auth.tabs.login")}</TabsTrigger>
						<TabsTrigger value="signup">{t("auth.tabs.signup")}</TabsTrigger>
					</TabsList>

					<TabsContent value="login" className="mt-6">
						<form
							className="space-y-4"
							onSubmit={async (e) => {
								e.preventDefault();
								const form = e.currentTarget as HTMLFormElement;
								const formData = new FormData(form);
								await login({
									email: String(formData.get("email-login") || ""),
									password: String(formData.get("password-login") || ""),
								});
								onOpenChange(false);
								navigate("/profile");
							}}
						>
							<div className="space-y-2">
								<Label htmlFor="email-login">{t("auth.fields.email")}</Label>
								<Input id="email-login" name="email-login" type="email" placeholder="name@example.com" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password-login">{t("auth.fields.password")}</Label>
								<Input id="password-login" name="password-login" type="password" required />
							</div>
							<Button type="submit" className="w-full">
								{t("auth.actions.login", { role: roleTitle })}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value="signup" className="mt-6">
						<form
							className="space-y-4"
							onSubmit={async (e) => {
								e.preventDefault();
								const form = e.currentTarget as HTMLFormElement;
								const formData = new FormData(form);
								const avatarUrl = String(formData.get("avatarUrl-signup") || "").trim() || undefined;
								if (role === "mentor") {
									await signup({
										role: "mentor",
										name: String(formData.get("name-signup") || ""),
										email: String(formData.get("email-signup") || ""),
										password: String(formData.get("password-signup") || ""),
										avatarUrl,
										expertise: String(formData.get("expertise") || ""),
									});
								} else {
									await signup({
										role: "user",
										name: String(formData.get("name-signup") || ""),
										email: String(formData.get("email-signup") || ""),
										password: String(formData.get("password-signup") || ""),
										avatarUrl,
										interests: String(formData.get("interests") || ""),
									});
								}
								onOpenChange(false);
								navigate("/profile");
							}}
						>
							<div className="space-y-2">
								<Label htmlFor="name-signup">{t("auth.fields.fullName")}</Label>
								<Input id="name-signup" name="name-signup" type="text" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email-signup">{t("auth.fields.email")}</Label>
								<Input id="email-signup" name="email-signup" type="email" placeholder="name@example.com" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="avatarUrl-signup">{t("auth.fields.avatarUrl")}</Label>
								<Input id="avatarUrl-signup" name="avatarUrl-signup" type="url" placeholder={t("auth.placeholders.avatarUrl") as string} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password-signup">{t("auth.fields.password")}</Label>
								<Input id="password-signup" name="password-signup" type="password" required />
							</div>
							{role === "mentor" ? (
								<div className="space-y-2">
									<Label htmlFor="expertise">{t("auth.fields.expertise")}</Label>
									<Input id="expertise" name="expertise" type="text" placeholder={t("auth.placeholders.expertise") as string} />
								</div>
							) : (
								<div className="space-y-2">
									<Label htmlFor="interests">{t("auth.fields.interests")}</Label>
									<Input id="interests" name="interests" type="text" placeholder={t("auth.placeholders.interests") as string} />
								</div>
							)}
							<Button type="submit" className="w-full">
								{t("auth.actions.signup", { role: roleTitle })}
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default AuthDialog;


