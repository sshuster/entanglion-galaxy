
import { Hero } from '@/components/Hero';
import { GameIntro } from '@/components/GameIntro';
import { GameBoard } from '@/components/GameBoard';
import { Layout } from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <GameIntro />
      <GameBoard />
    </Layout>
  );
};

export default Index;
