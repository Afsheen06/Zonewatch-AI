export const useParams = jest.fn(() => ({ id: "gate-a" }));
export const useRouter = jest.fn(() => ({ push: jest.fn(), replace: jest.fn() }));
export const usePathname = jest.fn(() => "/dashboard");
export const useSearchParams = jest.fn(() => new URLSearchParams());
