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
    messageActionsBox.childElementCount < 5
  ) {

    let hideButton: HTMLSpanElement = Object.assign(
      document.createElement("span"),
      {
        role: "link",
        ariaLabel: "Hide",
        className: "im-mess--reply _im_mess_hide",
        innerHTML: `
			<svg
				width="16"
				height="16"
				viewBox="0 0 12 12"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clip-path="url(#clip0_10495_2078)">
				 	<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M2.28717 1.21982C1.99427 0.926728 1.5194 0.926728 1.22651 1.21982C0.933613 1.5129 0.933613 1.98809 1.22651 2.28118L2.20596 3.26136C0.814385 4.24988 0 5.53113 0 5.99746C0 6.79799 2.4 10.0001 6 10.0001C6.89166 10.0001 7.7097 9.80367 8.43589 9.49594L9.72659 10.7876C10.0195 11.0807 10.4793 11.0656 10.7721 10.7725C11.065 10.4794 11.0801 10.0193 10.7873 9.72623L2.28717 1.21982ZM7.52427 8.58363L3.41566 4.47197C3.15156 4.91901 3 5.44052 3 5.99746C3 7.65541 4.34315 8.99945 6 8.99945C6.55648 8.99945 7.07757 8.84783 7.52427 8.58363Z"
						fill="currentColor"
				 	/>
				 	<path
						d="M9 5.99746C9 6.18114 8.98351 6.36097 8.95194 6.53554L10.5431 8.12773C11.4732 7.27467 12 6.3725 12 5.99746C12 5.19692 9.6 1.9948 6 1.9948C5.5035 1.9948 5.02983 2.05571 4.58212 2.16282L5.46227 3.04355C5.63673 3.01196 5.81644 2.99546 6 2.99546C7.65685 2.99546 9 4.3395 9 5.99746Z"
						fill="currentColor"
				 	/>
				</g>
				<defs>
				  	<clipPath id="clip0_10495_2078">
						<rect width="16" height="16" fill="white" />
				  	</clipPath>
				</defs>
			</svg>`,
      }
    );

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
