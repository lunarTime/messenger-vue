<template>
    <div class="blobs-wrapper">
        <div class="blob blob-purple" />
        <div class="blob blob-pink" />
        <div class="blob blob-blue" />
        <div class="blob blob-orange" />
    </div>
</template>

<style scoped>
    .blobs-wrapper {
        position: absolute;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
    }

    .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(160px);
        will-change: transform;
    }

    .blob-purple {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
        top: -150px;
        left: -150px;
        animation: float1 25s ease-in-out infinite;
    }

    .blob-pink {
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, #ec4899 0%, transparent 90%);
        top: 5%;
        right: -100px;
        animation: float2 36s ease-in-out infinite;
    }

    .blob-blue {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #3b82f6 0%, transparent 90%);
        bottom: 100px;
        left: 30%;
        animation: float3 22s ease-in-out infinite;
    }

    .blob-orange {
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, #ff8251 0%, transparent 90%);
        bottom: 30%;
        left: -100px;
        animation: float4 35s ease-in-out infinite;
    }

    @media (max-width: 768px) {
        .blob {
            filter: blur(100px);
        }

        .blob-purple {
            width: 300px;
            height: 300px;
            top: -100px;
            left: -100px;
        }

        .blob-pink {
            width: 250px;
            height: 250px;
            right: -50px;
        }

        .blob-blue {
            width: 280px;
            height: 280px;
            bottom: 50px;
            left: 10%;
        }

        .blob-orange {
            width: 270px;
            height: 270px;
            left: -50px;
        }

        @keyframes float1 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(100px, -150px);
            }
        }

        @keyframes float2 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(-120px, 200px);
            }
        }

        @keyframes float3 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(150px, -120px);
            }
        }

        @keyframes float4 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(30px, 250px);
            }
        }
    }

    @media (min-width: 769px) {
        @keyframes float1 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(180px, -280px);
            }
        }

        @keyframes float2 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(-240px, 400px);
            }
        }

        @keyframes float3 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(270px, -250px);
            }
        }

        @keyframes float4 {
            0%,
            100% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(50px, 550px);
            }
        }
    }
</style>
