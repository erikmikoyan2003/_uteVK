// const blackList = ["681701089"] // TODO DB
chrome.storage.local.clear(); // DEV

/**
 * Function to retrieve the main messageStack from the message elements
 * Check it by class name and the presence of attribute "data-peer"
 *
 * @param {Element} node is node whose parent elements
 * are searched until a message stack is obtained
 *
 * @param {number} i is a nesting index to prevent pointless
 * enumeration (if the stack was not found in the first 10 parent
 * elements, something is going wrong in our lives).
 *
 * @param {string} className is a message stack classname.
 * Now is "im-mess-stack _im_mess_stack "
 **/
function getMessageStack(
	node: Element,
	i = 10,
	className = "im-mess-stack _im_mess_stack "
): Element | null {
	if (node.parentElement) {
		if (
			node.parentElement.className.match(className) &&
			node.parentElement.hasAttribute("data-peer")
		) {
			return node.parentElement;
		} else {
			return i == 0 ? null : getMessageStack(node.parentElement, i--);
		}
	} else {
		return null;
	}
}

/**
 * Function to react to the appearance of a new message on vk.
 * Removes the block with messages from blocked users from the
 * DOM, and adds a "hide" icon for others
 * @param {Element} node is added node
 **/
async function reactToNewMessage(node: Element): Promise<void> {
	/**
	 * The topmost element of the message, contains all the
	 * components. The element will be removed from the DOM
	 * if the "data-peer" attribute is found in the blacklist
	 * @type {Element | null}
	 */
	const messageStack: Element | null = getMessageStack(node);
	if (!messageStack) {
		return console.error(
			"ERROR: MESSAGESTACK WASNT FOUND, PLEASE LET THE AUTHOR KNOW ABOUT THIS"
		);
	}
	// Message elements
	const messagePeerID: string | null = messageStack.getAttribute("data-peer");
	const messageActionsBox: Element | null =
		node.firstChild && <Element>node.firstChild;

	const storage = await chrome.storage.local.get(["blacklist"]);
	if (storage.blacklist && storage.blacklist.includes(messagePeerID)) {
		messageStack.remove();
	} else if (
		messagePeerID &&
		messageActionsBox &&
		!messageActionsBox.getAttribute("action-box-modified")
	) {
		messageActionsBox.setAttribute("action-box-modified", "true");

		let hideButton: HTMLSpanElement = Object.assign(document.createElement("span"), {
			role: "link",
			ariaLabel: "Hide",
			className: "im-mess-	-reply _im_mess_hide",
			innerHTML: `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16px"
				height="16px"
				viewBox="0 0 192 141.8"
				fill="currentColor"
				><path
				d="M96,6.9a98.08,98.08,0,0,0-31.33,5.17L81.21,28.61a44.8,44.8,0,0,1,57.08,57.08l24.42,24.41C181.3,95.12,192,77.66,192,70.9,192,58.1,153.6,6.9,96,6.9ZM119.55,109a44.8,44.8,0,1,1-47.1-76.22l-17.1-17.1A116.3,116.3,0,0,0,36.7,26.16C13.58,42.1,0,63.29,0,70.9c0,12.8,38.4,64,96,64a99.75,99.75,0,0,0,40.65-8.79,116.3,116.3,0,0,0,18.65-10.47h0L134.11,94.45A44.82,44.82,0,0,1,119.55,109Z"
				style="fill-rule:evenodd"
				/><path
				d="M163.88,138.78a10.28,10.28,0,0,1-14.56,0l-12.67-12.67L119.55,109,28.12,17.58A10.3,10.3,0,1,1,42.68,3l121.2,121.2A10.3,10.3,0,0,1,163.88,138.78Z"
				style="fill-rule:evenodd"
				/></svg
			>
			`
		});
		
		hideButton.addEventListener("click", async (event: MouseEvent) => {
			chrome.storage.local.get(["blacklist"], async (data) => {
				console.log(data);
				if (Object.keys(data).length == 0) {
					chrome.storage.local.set({ blacklist: [messagePeerID] });
				} else {
					chrome.storage.local.set({
						blacklist: [...data.blacklist, messagePeerID],
					});
				}
			});
		});
		messageActionsBox.insertAdjacentElement("afterbegin", hideButton);
	}
}

// document.addEventListener("DOMNodeInserted",

let observer: MutationObserver = new MutationObserver(
	async (records: MutationRecord[]): Promise<void> => {
		for (const record of records) {
			const node: Element = <Element>record.target;

			if (node.tagName == "LI" && node.className.match(/m-mess _im_mess/g)) {
				reactToNewMessage(node);
			}
		}
	}
);

observer.observe(document.documentElement, {
	attributes: true,
	childList: true,
	subtree: true,
});
