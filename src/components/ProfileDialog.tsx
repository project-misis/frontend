import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/hooks/use-auth";

export const ProfileDialog = () => {
	const { t } = useTranslation();
	const { user, isProfileOpen, closeProfile, updateProfile, logout } = useAuth();
	const [submitting, setSubmitting] = useState(false);

	const isMentor = useMemo(() => user?.role === "mentor", [user]);
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [expertise, setExpertise] = useState(user?.expertise || "");
	const [interests, setInterests] = useState(user?.interests || "");

	// Keep form in sync when opening with a (potentially) different user
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const syncFields = (u = user) => {
		setName(u?.name || "");
		setEmail(u?.email || "");
		setExpertise(u?.expertise || "");
		setInterests(u?.interests || "");
	};

	return (
		<Dialog
			open={isProfileOpen}
			onOpenChange={(open) => {
				if (!open) closeProfile();
				else syncFields();
			}}
		>
			<DialogContent className="bg-background/80 backdrop-blur-sm border-primary/20">
				<DialogHeader>
					<DialogTitle className="text-2xl">{t("profile.title")}</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						{t("profile.subtitle")}
					</DialogDescription>
				</DialogHeader>

				<form
					className="space-y-4 mt-2"
					onSubmit={async (e) => {
						e.preventDefault();
						if (!user) return;
						setSubmitting(true);
						try {
							await updateProfile({
								name,
								// email updates are common, treat as editable now, but backend can validate later
								// In production, consider email verification flow.
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore - email is part of AuthUser and accepted by UpdateProfileInput via Partial
								email,
								expertise: isMentor ? expertise : undefined,
								interests: !isMentor ? interests : undefined,
							});
							closeProfile();
						} finally {
							setSubmitting(false);
						}
					}}
				>
					<div className="space-y-2">
						<Label htmlFor="name">{t("profile.fields.fullName")}</Label>
						<Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">{t("profile.fields.email")}</Label>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					{isMentor ? (
						<div className="space-y-2">
							<Label htmlFor="expertise">{t("profile.fields.expertise")}</Label>
							<Input id="expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder={t("auth.placeholders.expertise") as string} />
						</div>
					) : (
						<div className="space-y-2">
							<Label htmlFor="interests">{t("profile.fields.interests")}</Label>
							<Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder={t("auth.placeholders.interests") as string} />
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<Button type="submit" className="flex-1" disabled={submitting}>
							{submitting ? t("profile.actions.saving") : t("profile.actions.save")}
						</Button>
						<Button type="button" variant="outline" onClick={() => closeProfile()}>
							{t("profile.actions.cancel")}
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={async () => {
								await logout();
								closeProfile();
							}}
						>
							{t("profile.actions.logout")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ProfileDialog;



