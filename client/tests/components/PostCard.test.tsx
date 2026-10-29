import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import PostCard from "@/components/PostCard";
import { Post } from "@/service/types";

function buildPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 1,
    title: "Título do post",
    body: "Conteúdo do post",
    liked: false,
    reactions: { likes: 192, dislikes: 25 },
    ...overrides,
  };
}

describe("PostCard - reações (likes e dislikes)", () => {
  test("deve exibir o número de curtidas do objeto reactions", () => {
    render(
      <PostCard post={buildPost()} isAuthenticated={false} onLike={jest.fn()} />
    );

    const likes = screen.getByTestId("post-likes");
    expect(likes).toHaveTextContent("192");
    expect(likes).toHaveAttribute("aria-label", "192 curtidas");
  });

  test("deve exibir o número de descurtidas do objeto reactions", () => {
    render(
      <PostCard post={buildPost()} isAuthenticated={false} onLike={jest.fn()} />
    );

    const dislikes = screen.getByTestId("post-dislikes");
    expect(dislikes).toHaveTextContent("25");
    expect(dislikes).toHaveAttribute("aria-label", "25 descurtidas");
  });

  test("deve exibir 0 quando o post tem zero curtidas e zero descurtidas", () => {
    render(
      <PostCard
        post={buildPost({ reactions: { likes: 0, dislikes: 0 } })}
        isAuthenticated={false}
        onLike={jest.fn()}
      />
    );

    expect(screen.getByTestId("post-likes")).toHaveTextContent("0");
    expect(screen.getByTestId("post-dislikes")).toHaveTextContent("0");
  });

  test("deve exibir 0 quando a API não retornar o objeto reactions", () => {
    const post = buildPost();
    // simula uma resposta sem o objeto reactions
    delete (post as Partial<Post>).reactions;

    render(<PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />);

    expect(screen.getByTestId("post-likes")).toHaveTextContent("0");
    expect(screen.getByTestId("post-dislikes")).toHaveTextContent("0");
  });

  test("deve exibir as reações junto ao título e ao corpo da postagem", () => {
    render(
      <PostCard post={buildPost()} isAuthenticated={false} onLike={jest.fn()} />
    );

    const card = screen.getByRole("listitem");
    expect(within(card).getByText("Título do post")).toBeInTheDocument();
    expect(within(card).getByText("Conteúdo do post")).toBeInTheDocument();
    expect(within(card).getByTestId("post-reactions")).toBeInTheDocument();
  });
});
