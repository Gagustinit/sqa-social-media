package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

class PostServiceTests {

  private UserPostReactionRepository reactionRepository;
  private RestTemplate restTemplate;
  private PostService postService;

  @BeforeEach
  void setUp() {
    reactionRepository = mock(UserPostReactionRepository.class);
    restTemplate = mock(RestTemplate.class);
    postService = new PostService(reactionRepository, restTemplate);
  }

  private static final String POSTS_JSON = """
      {
        "posts": [
          {
            "id": 1,
            "title": "Primeiro post",
            "body": "Conteudo 1",
            "reactions": { "likes": 192, "dislikes": 25 }
          },
          {
            "id": 2,
            "title": "Segundo post",
            "body": "Conteudo 2"
          }
        ],
        "total": 2,
        "skip": 0,
        "limit": 10
      }
      """;

  @SuppressWarnings("unchecked")
  private static List<Map<String, Object>> postsOf(Map<String, Object> result) {
    return (List<Map<String, Object>>) result.get("posts");
  }

  @Test
  @DisplayName("getPosts inclui o objeto reactions (likes e dislikes) vindo do DummyJSON")
  void deveIncluirReactionsNosPosts() {
    when(restTemplate.getForObject(contains("https://dummyjson.com/posts"), org.mockito.ArgumentMatchers.eq(String.class)))
        .thenReturn(POSTS_JSON);

    Map<String, Object> result = postService.getPosts(10, 0, null);

    Map<String, Object> first = postsOf(result).get(0);
    assertEquals(Map.of("likes", 192, "dislikes", 25), first.get("reactions"));
  }

  @Test
  @DisplayName("getPosts retorna reactions zeradas quando o DummyJSON não envia o objeto")
  void deveRetornarReactionsZeradasQuandoAusentes() {
    when(restTemplate.getForObject(contains("https://dummyjson.com/posts"), org.mockito.ArgumentMatchers.eq(String.class)))
        .thenReturn(POSTS_JSON);

    Map<String, Object> result = postService.getPosts(10, 0, null);

    Map<String, Object> second = postsOf(result).get(1);
    assertEquals(Map.of("likes", 0, "dislikes", 0), second.get("reactions"));
  }

  @Test
  @DisplayName("getPosts mantém o campo liked do usuário junto com as reactions")
  void deveManterCampoLikedJuntoComReactions() {
    when(restTemplate.getForObject(contains("https://dummyjson.com/posts"), org.mockito.ArgumentMatchers.eq(String.class)))
        .thenReturn(POSTS_JSON);

    UserPostReaction reaction = new UserPostReaction();
    reaction.setUserId(7L);
    reaction.setPostId(1L);
    when(reactionRepository.findByUserId(7L)).thenReturn(List.of(reaction));

    Map<String, Object> result = postService.getPosts(10, 0, 7L);

    Map<String, Object> first = postsOf(result).get(0);
    assertEquals(true, first.get("liked"));
    assertTrue(first.containsKey("reactions"));
    assertEquals(false, postsOf(result).get(1).get("liked"));
  }

  @Test
  @DisplayName("getLikedPosts inclui o objeto reactions de cada post curtido")
  void deveIncluirReactionsNosPostsCurtidos() {
    UserPostReaction reaction = new UserPostReaction();
    reaction.setUserId(7L);
    reaction.setPostId(1L);
    when(reactionRepository.findByUserId(7L)).thenReturn(List.of(reaction));
    when(restTemplate.getForObject("https://dummyjson.com/posts/1", String.class)).thenReturn("""
        {
          "id": 1,
          "title": "Primeiro post",
          "body": "Conteudo 1",
          "reactions": { "likes": 3, "dislikes": 1 }
        }
        """);

    Map<String, Object> result = postService.getLikedPosts(7L, 5, 0);

    Map<String, Object> first = postsOf(result).get(0);
    assertEquals(Map.of("likes", 3, "dislikes", 1), first.get("reactions"));
    assertEquals(true, first.get("liked"));
  }
}
