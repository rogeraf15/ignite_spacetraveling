import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Header from '../../components/Header';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './post.module.scss';

interface Test {
      heading: string;
      body: {
        text: string;
      }[];
}

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      };
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post } : PostProps) {
  return (
    <div className={styles.container}>
      <Header />
      <img src={post.data.banner.url} alt="banner"/>
      <div className={commonStyles.container}>
        <main className={styles.main}>
          <header>
            <h1>{post.data.title}</h1>
            <div>
              <div>
                <FiCalendar />
                  {post.first_publication_date}
              </div>
              <div>
                <FiUser />
               {post.data.author}
              </div>
              <div>
                <FiClock />
                4 min
              </div>
            </div>
          </header>

          <div>
            {post.data.content.map(itemContent => {
              return (
                <>
                  <h2>{itemContent.heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{__html: itemContent.body.text}}
                  />
                </>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

export const getStaticPaths = () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking'
  }

  // TODO
};

export const getStaticProps = async ({req, params}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response.data.content);

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), "dd MMM yyyy", {
      locale: ptBR,
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content:
        response.data.content.map((contentItem: Test) => {
          return {
            heading: contentItem.heading,
            body: {
               text: RichText.asHtml(contentItem.body)
            }
          }
        }),
    }
  }



  return{
    props: {
      post
    },
  }
  // TODO
};
