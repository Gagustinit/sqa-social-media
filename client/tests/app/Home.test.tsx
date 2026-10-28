import { AuthProvider } from "../../src/contexts/AuthContext";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import api from "../../src/service/api";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
}));

jest.mock("../../src/service/api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("App - Home", () => {
  test("deve renderizar o número de posts corretamente de acordo com a quantidade de posts retornada pela API", async () => {
    const mockResponse = {
      data: {
        posts: [
          { id: 1, title: "Post 1", body: "Content 1", liked: false },
          { id: 2, title: "Post 2", body: "Content 2", liked: false },
        ],
      },
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const { asFragment } = render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );

    await screen.findAllByRole("listitem");
    expect(screen.getAllByRole("listitem").length).toBe(2);
    expect(asFragment()).toMatchSnapshot();
  });
});
