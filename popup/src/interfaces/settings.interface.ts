/**
 * @prop {"Simple" | "Pretty"}  settings.modeF
 * The user list page display mode
 * - Simple — display only user ids;
 * - (TODO) Pretty — display users in block with photo and name;
 *
 * @prop {boolean}              settings.isBlurMode (#TODO)
 * If true, the messages will not be deleted from the DOM, they
 * will simply be blurred
 *
 * @prop {boolean}              settings.isHideOnlyInChats (#TODO)
 * If true, the messages will hide only in chats
 *
 * @prop {boolean}              settings.isAutoCensorship (#TODO)
 * If true, the messages with inappropriate content will be hidden.
 */
export default interface SettingsInterface {
	mode: "Simple" | "Pretty";
	isBlurMode: boolean;
	isHideOnlyInChats: boolean;
	isAutoCensorship: boolean;
}