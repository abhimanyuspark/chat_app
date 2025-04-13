export const FullName = ({ name, onChange, value, disabled }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm" htmlFor={name}>
        FullName
      </label>
      <div className="input bg-transparent validator w-full">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          required
          autoComplete="off"
          value={value}
          placeholder="Jhon Doe"
          onChange={onChange}
          name={name}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export const Email = ({ name, onChange, value, disabled }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm" htmlFor={name}>
        Email
      </label>
      <div className="input bg-transparent validator w-full">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          type="email"
          // autoComplete="off"
          placeholder="mail@site.com"
          required
          value={value}
          onChange={onChange}
          name={name}
          disabled={disabled}
          // pattern=""
        />
      </div>
    </div>
  );
};

export const Password = ({ name, onChange, value, show, onClick }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm" htmlFor={name}>
        Password
      </label>
      <div className="input bg-transparent validator w-full relative">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          name={name}
          placeholder="Password"
          minLength="3"
          // maxLength="10"
          autoComplete="off"
          // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,}"
          className="pr-10"
        />

        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={onClick}
        >
          {show ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.86-.68 1.665-1.196 2.387"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.98 8.223A10.477 10.477 0 0 0 2.458 12c1.274 4.057 5.065 7 9.542 7 1.355 0 2.646-.272 3.825-.764M19.423 15.338A10.477 10.477 0 0 0 21.542 12c-1.274-4.057-5.065-7-9.542-7-1.355 0-2.646.272-3.825.764M9.88 9.88a3 3 0 1 0 4.24 4.24M3 3l18 18"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export const Text = ({ name, onChange, value }) => {
  return (
    <div className="input bg-transparent w-full">
      <input
        type="text"
        value={value}
        autoComplete="off"
        placeholder="Type message..."
        onChange={onChange}
        name={name}
      />
    </div>
  );
};
